import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import EmptyState from "@/components/EmptyState";
import ErrorMessage from "@/components/ErrorMessage";
import Layout from "@/components/Layout";
import NoticeCard from "@/components/NoticeCard";
import NoticeCardSkeleton from "@/components/NoticeCardSkeleton";
import NoticeFilters from "@/components/NoticeFilters";
import Pagination from "@/components/Pagination";
import { DEFAULT_PAGE_SIZE } from "@/utils/constants";
import { apiRequest, buildNoticesQueryString, getErrorMessage } from "@/utils/helpers";

const INITIAL_FILTERS = {
  q: "",
  category: "",
  priority: "",
  page: 1,
};

export default function HomePage() {
  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingNoticeId, setDeletingNoticeId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const previousNoticesRef = useRef([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(filters.q);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters.q]);

  const hasActiveFilters = useMemo(
    () => Boolean(filters.q || filters.category || filters.priority),
    [filters.category, filters.priority, filters.q],
  );

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const queryString = buildNoticesQueryString({
      q: debouncedSearch,
      category: filters.category,
      priority: filters.priority,
      page: filters.page,
      limit: DEFAULT_PAGE_SIZE,
    });

    try {
      const data = await apiRequest(`/api/notices${queryString}`);
      setNotices(data.notices);
      setPagination(data.pagination);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError, "Unable to load notices. Please try again."));
      setNotices([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters.category, filters.page, filters.priority]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleFilterChange = (updates) => {
    setFilters((current) => ({
      ...current,
      ...updates,
    }));
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleDeleteRequest = (notice) => {
    setDeleteError("");
    setNoticeToDelete(notice);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;
    setNoticeToDelete(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!noticeToDelete || isDeleting) return;

    const deletedNotice = noticeToDelete;
    const deletedNoticeId = deletedNotice.id;

    setIsDeleting(true);
    setDeletingNoticeId(deletedNoticeId);
    setDeleteError("");
    previousNoticesRef.current = notices;

    setNotices((current) => current.filter((notice) => notice.id !== deletedNoticeId));
    setNoticeToDelete(null);

    try {
      await apiRequest(`/api/notices/${deletedNoticeId}`, {
        method: "DELETE",
      });

      toast.success("Notice deleted successfully.");
      await fetchNotices();
    } catch (deleteRequestError) {
      setNotices(previousNoticesRef.current);
      const message = getErrorMessage(deleteRequestError, "Unable to delete notice. Please try again.");
      setDeleteError(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setDeletingNoticeId(null);
    }
  };

  const showFilteredEmptyState = !isLoading && notices.length === 0 && hasActiveFilters;
  const showGlobalEmptyState = !isLoading && notices.length === 0 && !hasActiveFilters && !error;

  return (
    <Layout title="Campus Notice Board">
      <section>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Notices</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Search, filter, and browse campus announcements. Urgent notices are always sorted first by the server.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <NoticeFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {error ? <ErrorMessage message={error} className="mb-6" /> : null}
        {deleteError ? <ErrorMessage message={deleteError} className="mb-6" /> : null}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, index) => (
              <NoticeCardSkeleton key={index} />
            ))}
          </div>
        ) : showFilteredEmptyState ? (
          <EmptyState
            title="No matching notices."
            message="Try adjusting your search or filters to find what you are looking for."
            showCreateButton
            actionLabel="Clear Filters"
            onAction={handleClearFilters}
          />
        ) : showGlobalEmptyState ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDelete={handleDeleteRequest}
                  isDeleting={deletingNoticeId === notice.id}
                />
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={(page) => handleFilterChange({ page })} />
          </>
        )}
      </section>

      <DeleteConfirmationModal
        notice={noticeToDelete}
        isOpen={Boolean(noticeToDelete)}
        isDeleting={isDeleting}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Layout>
  );
}
