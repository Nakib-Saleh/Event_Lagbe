import { useEffect, useMemo, useRef, useState } from "react";
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const fmtDate = (d) => new Date(d).toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

const fakeApi = (fn, { failRate = 0.08, delay = 400 } = {}) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < failRate) rej(new Error("Network error. Try again."));
      else res(fn());
    }, delay);
  });

// LocalStorage helpers
const LS_KEY = "review_component_state_v1";
const loadLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
const saveLS = (data) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
};


function StarRating({ value = 0, onChange, size = "text-xl", readOnly = false, label = "rating" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="inline-flex items-center" aria-label={label} role="radiogroup">
      {stars.map((n) => {
        const active = n <= value;
        const base =
          "cursor-pointer select-none px-0.5 leading-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-sm";
        const char = active ? "★" : "☆";
        return (
          <span
            key={n}
            role="radio"
            aria-checked={active}
            tabIndex={readOnly ? -1 : 0}
            className={`${base} ${size}`}
            onClick={readOnly ? undefined : () => onChange?.(n)}
            onKeyDown={
              readOnly
                ? undefined
                : (e) => {
                    if (e.key === "Enter" || e.key === " ") onChange?.(n);
                    if (e.key === "ArrowRight") onChange?.(clamp(value + 1, 1, 5));
                    if (e.key === "ArrowLeft") onChange?.(clamp(value - 1, 1, 5));
                  }
            }
          >
            <span className={active ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"}>
              {char}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function ReviewCard({ r, onEdit, onDelete }) {
  return (
    <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/60 dark:border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {r.name}
            </span>
            <span className="text-xs text-gray-400">• {fmtDate(r.date)}</span>
          </div>
          <div className="mt-1">
            <StarRating value={r.rating} readOnly size="text-base" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => onEdit?.(r)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(r)}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
        {r.comment}
      </p>
      {r.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {r.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ReviewStats({ list }) {
  const { avg, counts } = useMemo(() => {
    if (!list.length) return { avg: 0, counts: [0, 0, 0, 0, 0] };
    const counts = [0, 0, 0, 0, 0];
    let total = 0;
    for (const r of list) {
      total += r.rating;
      counts[r.rating - 1]++;
    }
    return { avg: +(total / list.length).toFixed(2), counts };
  }, [list]);

  const total = list.length || 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl border dark:border-gray-700">
        <div className="text-sm text-gray-500">Average Rating</div>
        <div className="mt-1 flex items-center gap-3">
          <div className="text-3xl font-bold">{avg}</div>
          <StarRating value={Math.round(avg)} readOnly />
        </div>
        <div className="text-xs text-gray-400 mt-1">{list.length} reviews</div>
      </div>
      <div className="p-4 rounded-xl border dark:border-gray-700 sm:col-span-2">
        <div className="text-sm text-gray-500">Distribution</div>
        <div className="mt-2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = counts[n - 1];
            const pct = Math.round((count / total) * 100);
            return (
              <div key={n} className="flex items-center gap-2">
                <span className="w-8 text-xs tabular-nums">{n}★</span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 dark:bg-yellow-500"
                    style={{ width: `${pct}%` }}
                    aria-label={`${pct}%`}
                  />
                </div>
                <span className="w-10 text-right text-xs text-gray-500">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ initial, onCancel, onSave, busy }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [error, setError] = useState("");

  const nameRef = useRef(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required.");
    if (!comment.trim()) return setError("Please write a short review.");
    if (rating < 1 || rating > 5) return setError("Select a rating (1–5).");
    setError("");
    onSave?.({
      id: initial?.id ?? uid(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      date: initial?.date ?? new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {error ? (
        <div className="text-sm px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900">
          {error}
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Name</label>
          <input
            ref={nameRef}
            className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Rating</label>
          <div className="flex items-center justify-between gap-3">
            <StarRating value={rating} onChange={setRating} />
            <span className="text-sm text-gray-500">{rating || "-"}/5</span>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Review</label>
        <textarea
          className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike?"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Tags (comma separated)</label>
        <input
          className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="delivery, quality, value"
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? "Saving..." : initial ? "Save changes" : "Submit review"}
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


const seed = [
  { id: uid(), name: "Alice Johnson", rating: 5, comment: "Amazing experience! Everything was smooth and fast.", date: "2025-09-01", tags: ["delivery", "support"] },
  { id: uid(), name: "Michael Smith", rating: 4, comment: "Very good service, but delivery could be a little faster.", date: "2025-08-29", tags: ["delivery"] },
  { id: uid(), name: "Sophia Lee", rating: 3, comment: "It was okay. Expected a bit more quality for the price.", date: "2025-08-27", tags: ["quality", "value"] },
  { id: uid(), name: "David Kim", rating: 5, comment: "Excellent! Will definitely recommend to my friends.", date: "2025-08-25", tags: ["recommend"] },
  { id: uid(), name: "Nadia Rahman", rating: 4, comment: "Clean UI, straightforward flow. Minor bugs here and there.", date: "2025-08-24", tags: ["ui", "bugs"] },
  { id: uid(), name: "Omar Faruk", rating: 2, comment: "Checkout failed twice. Support helped but it took long.", date: "2025-08-22", tags: ["support", "checkout"] },
  { id: uid(), name: "Priya Patel", rating: 5, comment: "Super fast shipping and great packaging.", date: "2025-08-21", tags: ["shipping", "packaging"] },
  { id: uid(), name: "Chen Wei", rating: 4, comment: "Good value overall. Will buy again.", date: "2025-08-19", tags: ["value"] },
  { id: uid(), name: "Hiro Tanaka", rating: 1, comment: "Item arrived damaged. Disappointed.", date: "2025-08-18", tags: ["quality", "damage"] },
  { id: uid(), name: "Liam Wilson", rating: 5, comment: "Loved it. Exactly as described.", date: "2025-08-17", tags: ["description"] },
  { id: uid(), name: "Emma Brown", rating: 4, comment: "Easy to use and intuitive.", date: "2025-08-16", tags: ["ux"] },
  { id: uid(), name: "Noah Garcia", rating: 3, comment: "Neutral. Nothing special, nothing terrible.", date: "2025-08-14" },
  { id: uid(), name: "Mia Martinez", rating: 5, comment: "Customer support was fantastic!", date: "2025-08-12", tags: ["support"] },
  { id: uid(), name: "Arjun Mehta", rating: 2, comment: "Too many steps during signup.", date: "2025-08-10", tags: ["onboarding"] },
  { id: uid(), name: "Zara Noor", rating: 4, comment: "Feature set is solid for the price.", date: "2025-08-08", tags: ["features", "value"] },
  { id: uid(), name: "Ethan Clark", rating: 5, comment: "Works flawlessly across devices.", date: "2025-08-06", tags: ["compatibility"] },
  { id: uid(), name: "Olivia Davis", rating: 1, comment: "Never received my order.", date: "2025-08-05", tags: ["shipping"] },
  { id: uid(), name: "Hasan Ahmed", rating: 3, comment: "Average performance, acceptable battery life.", date: "2025-08-04", tags: ["performance", "battery"] },
  { id: uid(), name: "Nina Petrova", rating: 5, comment: "Five stars for reliability.", date: "2025-08-02", tags: ["reliability"] },
  { id: uid(), name: "Jamal Uddin", rating: 4, comment: "Setup was quick and simple.", date: "2025-08-01", tags: ["setup"] },
];

export default function Review() {
  const [reviews, setReviews] = useState(() => loadLS() ?? seed);
  const [search, setSearch] = useState("");
  const [minStars, setMinStars] = useState(0);
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc | date_asc | rating_desc | rating_asc
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState("");

  // persist
  useEffect(() => saveLS(reviews), [reviews]);

  // derived list
  const filtered = useMemo(() => {
    let list = [...reviews];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          (r.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (minStars > 0) list = list.filter((r) => r.rating >= minStars);

    switch (sortBy) {
      case "date_asc":
        list.sort((a, b) => +new Date(a.date) - +new Date(b.date));
        break;
      case "rating_desc":
        list.sort((a, b) => b.rating - a.rating || +new Date(b.date) - +new Date(a.date));
        break;
      case "rating_asc":
        list.sort((a, b) => a.rating - b.rating || +new Date(b.date) - +new Date(a.date));
        break;
      default:
        list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
    return list;
  }, [reviews, search, minStars, sortBy]);

  // pagination
  const PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageSafe = clamp(page, 1, totalPages);
  const pageSlice = filtered.slice((pageSafe - 1) * PER_PAGE, pageSafe * PER_PAGE);

  useEffect(() => {
    // if filters change, reset to first page
    setPage(1);
  }, [search, minStars, sortBy]);

  const handleCreateOrUpdate = async (r) => {
    setBusyId(r.id);
    const isEdit = reviews.some((x) => x.id === r.id);
    const rollback = structuredClone(reviews);

    // optimistic
    setReviews((prev) => {
      if (isEdit) return prev.map((x) => (x.id === r.id ? { ...x, ...r } : x));
      return [r, ...prev];
    });

    try {
      await fakeApi(() => true);
      setToast(isEdit ? "Review updated." : "Review added.");
      setEditing(null);
    } catch (e) {
      setReviews(rollback);
      setToast(e.message || "Failed to save review.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (r) => {
    if (!confirm("Delete this review?")) return;
    setBusyId(r.id);
    const rollback = structuredClone(reviews);
    setReviews((prev) => prev.filter((x) => x.id !== r.id));

    try {
      await fakeApi(() => true);
      setToast("Review deleted.");
    } catch (e) {
      setReviews(rollback);
      setToast(e.message || "Failed to delete review.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Reviews</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing({})}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            New Review
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 sm:col-span-2"
          placeholder="Search name, comment, tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
          value={minStars}
          onChange={(e) => setMinStars(Number(e.target.value))}
        >
          <option value={0}>All ratings</option>
          <option value={5}>5★ only</option>
          <option value={4}>4★ & up</option>
          <option value={3}>3★ & up</option>
          <option value={2}>2★ & up</option>
          <option value={1}>1★ & up</option>
        </select>
        <select
          className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="rating_desc">Highest rated</option>
          <option value="rating_asc">Lowest rated</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mt-5">
        <ReviewStats list={filtered} />
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {pageSlice.map((r) => (
          <div key={r.id} className={busyId === r.id ? "opacity-60 pointer-events-none" : ""}>
            <ReviewCard
              r={r}
              onEdit={(rev) => setEditing(rev)}
              onDelete={handleDelete}
            />
          </div>
        ))}
        {!pageSlice.length ? (
          <div className="text-center text-gray-500 py-8">No reviews match your filters.</div>
        ) : null}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-md border dark:border-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}
            disabled={pageSafe === 1}
          >
            Prev
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Page <span className="font-semibold">{pageSafe}</span> / {totalPages}
          </div>
          <button
            className="px-3 py-1.5 rounded-md border dark:border-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}
            disabled={pageSafe === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Drawer / Modal-ish editor */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-50 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editing?.id ? "Edit Review" : "Add Review"}
              </h3>
              <button
                className="px-2 py-1 rounded-md border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setEditing(null)}
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <ReviewForm
                initial={editing && editing.id ? editing : null}
                onCancel={() => setEditing(null)}
                onSave={handleCreateOrUpdate}
                busy={!!busyId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-gray-900 text-white shadow-lg"
          onAnimationEnd={() => setToast("")}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
