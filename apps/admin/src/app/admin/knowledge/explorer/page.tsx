import React from "react";

export default function DocumentExplorerPage() {
  const documents = [
    { id: "1", title: "Enterprise Architecture Blueprint", format: "PDF", size: "4.2 MB", status: "INDEXED", language: "English" },
    { id: "2", title: "Knowledge Graph Ontology Model", format: "JSON", size: "1.8 MB", status: "PARSED", language: "English" },
    { id: "3", title: "Context Window Token Metrics", format: "CSV", size: "850 KB", status: "INDEXED", language: "English" },
  ];

  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-white">Enterprise Document Explorer</h1>
        <p className="text-xs text-slate-400 mt-1">Multi-format Document Parsing, OCR & Embeddings</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Format</th>
              <th className="p-4">Size</th>
              <th className="p-4">Status</th>
              <th className="p-4">Language</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-semibold text-white">{doc.title}</td>
                <td className="p-4"><span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{doc.format}</span></td>
                <td className="p-4">{doc.size}</td>
                <td className="p-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{doc.status}</span></td>
                <td className="p-4">{doc.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
