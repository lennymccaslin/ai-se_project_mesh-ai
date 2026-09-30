import "./KnowledgeBase.css";
import { useEffect, useState } from "react";
import type { KnowledgeDoc } from "../../utils/api";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments } from "../../utils/api";

export default function KnowledgeBase() {
	const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

    useEffect(() => {
  const load = async () => {
    try {
      const res = await getDocuments();
      if (res.error) {
        setError(res.error.message);
      } else {
        setDocuments(res.data ?? []);
      }
    } catch {
      setError("Failed to Load Documents");
    } finally {
      setIsLoading(false);
    }
  };

  load();
}, []);

    const handleFileSelect = (file: File) => {
  const newDoc: KnowledgeDoc = {
    _id: Date.now().toString(),
    title: file.name,
    fileName: file.name,
    userId: 'local',
    createdAt: new Date().toISOString(),
  };
  setDocuments((currentDocuments) => [newDoc, ...currentDocuments]);
};

    const handleRemoveDocument = (documentId: string) => {
  setDocuments((currentDocuments) =>
    currentDocuments.filter((doc) => doc._id !== documentId)
  );
};

	return <div className="knowledge-base">
  <h1>Manage Your Knowledge Base</h1>
        <section className="knowledge-base__content">
            <p>Upload documents (PDF)</p>
            <UploadArea onFileSelect={handleFileSelect}>
            </UploadArea>
            {isLoading && <p>Loading...</p>}
            {!isLoading && error !== null && <p role="alert">{error}</p>}
            {!isLoading && error === null && documents.length === 0 && (
              <p>No documents yet.</p>
            )}
            {!isLoading && error === null && documents.length > 0 && (
              <ul className="knowledge-base__documents">
                {documents.map((doc) => (
                  <li className="knowledge-base__document" key={doc._id}>
                    <span>{doc.title}</span>
                    <button
                      className="knowledge-base__remove"
                      type="button"
                      aria-label={`Remove ${doc.title}`}
                      onClick={() => handleRemoveDocument(doc._id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className="knowledge-base__btn-save">Save</button>
        </section>
    </div>;
}
