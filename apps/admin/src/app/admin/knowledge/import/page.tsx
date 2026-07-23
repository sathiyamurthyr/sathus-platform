import React from "react";

export default function ImportExportWizardPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold text-white">Import & Export Job Wizard</h1>
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-4">
        <p className="text-slate-300">Drag & drop enterprise documents or select JSON/ZIP knowledge archives to ingest into the pipeline.</p>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded">Select Files</button>
      </div>
    </div>
  );
}
