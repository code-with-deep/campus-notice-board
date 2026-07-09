import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ErrorMessage from "@/components/ErrorMessage";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import NoticeForm from "@/components/NoticeForm";
import { apiRequest, getErrorMessage } from "@/utils/helpers";

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [formError, setFormError] = useState("");

  const fetchNotice = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setLoadError("");

    try {
      const data = await apiRequest(`/api/notices/${id}`);
      setNotice(data.notice);
    } catch (fetchError) {
      setNotice(null);
      const message = getErrorMessage(fetchError, "Unable to load notice. Please try again.");
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (router.isReady) {
      fetchNotice();
    }
  }, [router.isReady, fetchNotice]);

  const handleSubmit = async (values) => {
    if (!id || isSubmitting) return;

    setIsSubmitting(true);
    setServerErrors(null);
    setFormError("");

    try {
      await apiRequest(`/api/notices/${id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      toast.success("Notice updated successfully.");
      await router.push("/");
    } catch (submitError) {
      if (submitError.details) {
        setServerErrors(submitError.details);
      }

      const message = getErrorMessage(submitError, "Unable to update notice. Please try again.");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Edit Notice | Campus Notice Board">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Edit Notice</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Update the selected notice and save your changes.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          {loadError ? <ErrorMessage message={loadError} className="mb-6" /> : null}
          {formError ? <ErrorMessage message={formError} className="mb-6" /> : null}

          {isLoading ? (
            <LoadingSpinner label="Loading notice..." />
          ) : notice ? (
            <NoticeForm
              initialValues={notice}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              serverErrors={serverErrors}
              submitLabel="Update Notice"
              showReset
            />
          ) : !loadError ? (
            <ErrorMessage message="The requested notice could not be found." />
          ) : null}
        </div>
      </section>
    </Layout>
  );
}
