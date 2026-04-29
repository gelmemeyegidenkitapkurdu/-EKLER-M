import { adminEmail, supabase } from "../lib/supabaseClient";

export type AdminProfileInput = {
  about: string;
  email: string;
  instagram: string;
  image: string;
};

function generateId() {
  const timestamp = Date.now().toString().padStart(15, '0');
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

async function must<T>(promise: PromiseLike<{ data: T; error: any }>, fallback: string): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    throw new Error(getErrorMessage(error, fallback));
  }
  return data;
}

// ============================================
// AUTH
// ============================================
export async function signInAdmin(email: string, password: string) {
  const data = await must(
    supabase.auth.signInWithPassword({ email, password }),
    "Giriş sırasında hata oluştu"
  );

  const userEmail = data.user?.email?.toLowerCase();
  if (userEmail !== adminEmail.toLowerCase()) {
    await supabase.auth.signOut();
    throw new Error("Bu hesap yönetici hesabı değil");
  }

  return { success: true };
}

export async function signOutAdmin() {
  await must(supabase.auth.signOut(), "Çıkış sırasında hata oluştu");
}

export async function getCurrentAdminStatus() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return false;
  return data.user.email?.toLowerCase() === adminEmail.toLowerCase();
}

// ============================================
// ADMIN PROFILE
// ============================================
export async function fetchAdminProfile() {
  const row = await must(
    supabase
      .from("admin_profile")
      .select("id, about, email, instagram, image")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle(),
    "Profil verisi alınamadı"
  );

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    about: row.about ?? "",
    email: row.email ?? adminEmail,
    instagram: row.instagram ?? "",
    image: row.image || ""
  };
}

export async function upsertAdminProfile(profile: AdminProfileInput) {
  await must(
    supabase.from("admin_profile").upsert(
      {
        id: 1,
        about: profile.about,
        email: profile.email,
        instagram: profile.instagram,
        image: profile.image,
      },
      { onConflict: "id" }
    ),
    "Profil güncellenemedi"
  );
}

// ============================================
// WRITINGS
// ============================================
export async function fetchWritings() {
  const rows = await must(
    supabase.from("writings").select("*").order("id", { ascending: false }),
    "Yazılar alınamadı"
  );

  return rows ?? [];
}

export async function createWriting(writing: any) {
  const id = writing.id ?? generateId();
  await must(
    supabase.from("writings").insert({
      ...writing,
      id,
      date: writing.date ?? new Date().toISOString().split("T")[0],
    }),
    "Yazı eklenemedi"
  );

  return { id };
}

export async function updateWriting(id: string, data: any) {
  await must(supabase.from("writings").update(data).eq("id", id), "Yazı güncellenemedi");
  return { id };
}

export async function deleteWriting(id: string) {
  await must(supabase.from("writings").delete().eq("id", id), "Yazı silinemedi");
  return { id };
}

// ============================================
// BOOKS
// ============================================
export async function fetchBooks() {
  const rows = await must(supabase.from("books").select("*").order("id", { ascending: false }), "Kitaplar alınamadı");
  return rows ?? [];
}

export async function createBook(book: any) {
  const id = book.id ?? generateId();
  await must(supabase.from("books").insert({ ...book, id }), "Kitap eklenemedi");
  return { id };
}

export async function updateBook(id: string, data: any) {
  await must(supabase.from("books").update(data).eq("id", id), "Kitap güncellenemedi");
  return { id };
}

export async function deleteBook(id: string) {
  await must(supabase.from("books").delete().eq("id", id), "Kitap silinemedi");
  return { id };
}

// ============================================
// SUGGESTIONS
// ============================================
export async function fetchSuggestions() {
  const rows = await must(
    supabase.from("suggestions").select("*").order("id", { ascending: false }),
    "Öneriler alınamadı"
  );
  return rows ?? [];
}

export async function createSuggestion(suggestion: any) {
  const id = suggestion.id ?? generateId();
  await must(
    supabase.from("suggestions").insert({ ...suggestion, id }),
    "Öneri eklenemedi"
  );
  return { id };
}

export async function updateSuggestion(id: string, data: any) {
  await must(
    supabase.from("suggestions").update(data).eq("id", id),
    "Öneri güncellenemedi"
  );
  return { id };
}

export async function deleteSuggestion(id: string) {
  await must(supabase.from("suggestions").delete().eq("id", id), "Öneri silinemedi");
  return { id };
}

// ============================================
// POLLS
// ============================================
export async function fetchPolls() {
  const polls = await must(supabase.from("polls").select("*").order("id", { ascending: false }), "Anketler alınamadı");
  const options = await must(
    supabase.from("poll_options").select("id, poll_id, text, votes"),
    "Anket seçenekleri alınamadı"
  );

  const optionsByPoll = new Map<string, any[]>();
  for (const option of options ?? []) {
    const key = option.poll_id as string;
    if (!optionsByPoll.has(key)) {
      optionsByPoll.set(key, []);
    }
    optionsByPoll.get(key)!.push({
      id: option.id,
      text: option.text ?? "",
      votes: option.votes ?? 0,
    });
  }

  return (polls ?? []).map((poll) => ({
    id: poll.id,
    question: poll.question ?? "",
    totalVotes: poll.total_votes ?? 0,
    views: poll.view_count ?? 0,
    options: optionsByPoll.get(poll.id) ?? [],
  }));
}

export async function createPoll(poll: any) {
  const id = poll.id ?? generateId();

  await must(
    supabase.from("polls").insert({
      id,
      question: poll.question,
      total_votes: poll.totalVotes ?? 0,
      view_count: poll.views ?? 0,
    }),
    "Anket eklenemedi"
  );

  const options = (poll.options ?? []).map((option: any) => ({
    id: option.id ?? generateId(),
    poll_id: id,
    text: option.text,
    votes: option.votes ?? 0,
  }));

  if (options.length > 0) {
    await must(supabase.from("poll_options").insert(options), "Anket seçenekleri eklenemedi");
  }

  return { id };
}

export async function updatePoll(id: string, data: any) {
  if (data.question !== undefined || data.views !== undefined) {
    const updateData: any = {};
    if (data.question !== undefined) updateData.question = data.question;
    if (data.views !== undefined) updateData.view_count = data.views;
    await must(
      supabase.from("polls").update(updateData).eq("id", id),
      "Anket güncellenemedi"
    );
  }

  if (Array.isArray(data.options)) {
    await must(
      supabase.from("poll_options").delete().eq("poll_id", id),
      "Eski anket seçenekleri silinemedi"
    );

    const nextOptions = data.options.map((option: any) => ({
      id: option.id ?? generateId(),
      poll_id: id,
      text: option.text,
      votes: option.votes ?? 0,
    }));

    if (nextOptions.length > 0) {
      await must(
        supabase.from("poll_options").insert(nextOptions),
        "Yeni anket seçenekleri eklenemedi"
      );
    }

    const totalVotes = nextOptions.reduce(
      (sum: number, option: any) => sum + (option.votes ?? 0),
      0
    );

    await must(
      supabase.from("polls").update({ total_votes: totalVotes }).eq("id", id),
      "Anket toplam oy sayısı güncellenemedi"
    );
  }

  return { id };
}

export async function deletePoll(id: string) {
  await must(
    supabase.from("poll_options").delete().eq("poll_id", id),
    "Anket seçenekleri silinemedi"
  );
  await must(supabase.from("polls").delete().eq("id", id), "Anket silinemedi");
  return { id };
}

export async function votePollOption(pollId: string, optionId: string) {
  await must(
    supabase.rpc("vote_poll_option", {
      p_poll_id: pollId,
      p_option_id: optionId,
    }),
    "Oy verme işlemi başarısız"
  );

  return { success: true };
}

// ============================================
// INTERVIEWS
// ============================================
export async function fetchInterviews() {
  const interviews = await must(
    supabase.from("interviews").select("*").order("id", { ascending: false }),
    "Röportajlar alınamadı"
  );
  const dialogues = await must(
    supabase.from("dialogues").select("id, interview_id, speaker, text, sort_order").order("sort_order", { ascending: true }),
    "Röportaj konuşmaları alınamadı"
  );

  const dialoguesByInterview = new Map<string, any[]>();
  for (const dialogue of dialogues ?? []) {
    const key = dialogue.interview_id as string;
    if (!dialoguesByInterview.has(key)) {
      dialoguesByInterview.set(key, []);
    }
    dialoguesByInterview.get(key)!.push({
      id: dialogue.id,
      speaker: dialogue.speaker,
      text: dialogue.text,
      sort_order: dialogue.sort_order ?? 0,
    });
  }

  return (interviews ?? []).map((item) => ({
    id: item.id,
    title: item.title ?? "",
    description: item.description ?? "",
    photo: item.photo ?? "",
    interviewer: item.interviewer ?? "",
    interviewee: item.interviewee ?? "",
    dialogues: dialoguesByInterview.get(item.id) ?? [],
    views: item.view_count ?? 0,
    created_at: item.created_at ?? "",
  }));
}

export async function createInterview(interview: any) {
  const id = interview.id ?? generateId();

  await must(
    supabase.from("interviews").insert({
      id,
      title: interview.title,
      description: interview.description,
      photo: interview.photo,
      interviewer: interview.interviewer,
      interviewee: interview.interviewee,
      view_count: interview.views ?? 0,
      created_at: interview.created_at ?? new Date().toISOString(),
    }),
    "Röportaj eklenemedi"
  );

  const dialogues = (interview.dialogues ?? []).map((dialogue: any, index: number) => ({
    id: dialogue.id ?? generateId(),
    interview_id: id,
    speaker: dialogue.speaker,
    text: dialogue.text,
    sort_order: dialogue.sort_order ?? index,
  }));

  if (dialogues.length > 0) {
    await must(supabase.from("dialogues").insert(dialogues), "Konuşma eklenemedi");
  }

  return { id };
}

export async function updateInterview(id: string, data: any) {
  const updateData: any = {
    title: data.title,
    description: data.description,
    photo: data.photo,
    interviewer: data.interviewer,
    interviewee: data.interviewee,
  };
  if (data.views !== undefined) {
    updateData.view_count = data.views;
  }
  await must(
    supabase
      .from("interviews")
      .update(updateData)
      .eq("id", id),
    "Röportaj güncellenemedi"
  );

  if (Array.isArray(data.dialogues)) {
    await must(
      supabase.from("dialogues").delete().eq("interview_id", id),
      "Eski konuşmalar temizlenemedi"
    );

    const dialogues = data.dialogues.map((dialogue: any, index: number) => ({
      id: dialogue.id ?? generateId(),
      interview_id: id,
      speaker: dialogue.speaker,
      text: dialogue.text,
      sort_order: dialogue.sort_order ?? index,
    }));

    if (dialogues.length > 0) {
      await must(supabase.from("dialogues").insert(dialogues), "Yeni konuşmalar eklenemedi");
    }
  }

  return { id };
}

export async function deleteInterview(id: string) {
  await must(
    supabase.from("dialogues").delete().eq("interview_id", id),
    "Röportaj konuşmaları silinemedi"
  );
  await must(supabase.from("interviews").delete().eq("id", id), "Röportaj silinemedi");
  return { id };
}

// ============================================
// ANNOUNCEMENTS
// ============================================
export async function fetchAnnouncements() {
  const rows = await must(
    supabase.from("announcements").select("*").order("id", { ascending: false }),
    "Duyurular alınamadı"
  );
  return rows ?? [];
}

export async function createAnnouncement(announcement: any) {
  const id = announcement.id ?? generateId();
  await must(
    supabase.from("announcements").insert({
      ...announcement,
      id,
      date: announcement.date ?? new Date().toISOString().split("T")[0],
    }),
    "Duyuru eklenemedi"
  );
  return { id };
}

export async function updateAnnouncement(id: string, data: any) {
  await must(
    supabase.from("announcements").update(data).eq("id", id),
    "Duyuru güncellenemedi"
  );
  return { id };
}

export async function deleteAnnouncement(id: string) {
  await must(
    supabase.from("announcements").delete().eq("id", id),
    "Duyuru silinemedi"
  );
  return { id };
}
