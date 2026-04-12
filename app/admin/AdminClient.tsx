"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Edit3, Search, Upload, Plus } from "lucide-react";

const AIRTABLE_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN_ADMIN || "";
const BASE = "appo9jJWfID89uSUC";
const TABLE = "tblLADTjgy121q5Ws";
const ADMIN_PASSWORD = "mrwalls2026";

// ─── Types ────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  patternFamily: string;
  pattern: string;
  title: string;
  cloudinaryUrl: string;
  sector: string;
  corianColor: string;
  isBacklit: boolean;
  keywords: string;
  description: string;
  design_type: string;
  specReady: boolean;
  is_hero: boolean;
  is_exterior: boolean;
  applicationHero: boolean;
  project_name: string;
  render_texture_url: string;
  application: string;
}

// Canonical application values — matches nav and application pages (final 10)
const CANONICAL_APPLICATIONS = [
  "Elevator Lobby",
  "Feature Wall",
  "Reception",
  "Reception Desk",
  "Grand Entry",
  "Hallway",
  "Ceiling",
  "Branding",
  "Facade",
  "Water Feature",
];
const SECTORS_LIST = ["Healthcare","Hospitality","Corporate","Education","Aviation","Multifamily","Residential","Retail","Cultural","General"];
const COLORS_LIST = ["Glacier White","Designer White","Arctic White","Linen","Bone","Cameo White","Seashell","Hemp","Cotton","Deep Nocturne"];

// ─── Add New Modal ────────────────────────────────────────────────────────
function AddNewModal({ onClose, onAdd }: { onClose: () => void; onAdd: (record: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    patternFamily: "", title: "", sector: "General", application: "",
    corianColor: "Glacier White", isBacklit: false, design_type: "Spec-Ready",
    keywords: "", description: "", project_name: "", is_hero: false, is_exterior: false,
  });

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    // Auto-suggest title from filename
    const name = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    if (!form.title) setForm(prev => ({ ...prev, title: name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert("Please select an image first"); return; }
    setUploading(true);

    // 1. Upload to Cloudinary
    const family = (form.patternFamily || "custom").toLowerCase().replace(/\s+/g, "-");
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
    const publicId = `makereal/${family}/${Date.now()}-${filename.replace(/\.[^/.]+$/, "")}`;
    const ts = Math.floor(Date.now() / 1000).toString();
    const sigResp = await fetch("/api/cloudinary-sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: publicId, timestamp: ts }),
    });
    const { signature } = await sigResp.json();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", "744384844353185");
    fd.append("timestamp", ts);
    fd.append("public_id", publicId);
    fd.append("signature", signature);
    const upResp = await fetch("https://api.cloudinary.com/v1_1/dtlodxxio/image/upload", { method: "POST", body: fd });
    const upData = await upResp.json();
    setUploading(false);

    if (!upData.secure_url) { alert("Upload failed: " + (upData.error?.message || "unknown")); return; }

    // 2. Save to Airtable
    setSaving(true);
    const fields: any = {
      cloudinaryUrl: upData.secure_url,
      specReady: form.design_type === "Spec-Ready",
    };
    // Only include non-empty values — Airtable rejects "" for Single Select fields
    Object.entries(form).forEach(([k, v]) => {
      // include all non-empty fields including application
      if (v !== "" && v !== null && v !== undefined) fields[k] = v;
    });

    const resp = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    const rec = await resp.json();
    setSaving(false);

    if (rec.id) {
      setDone(true);
      onAdd({ id: rec.id, ...fields });
      setTimeout(onClose, 1200);
    } else {
      alert("Airtable error: " + JSON.stringify(rec.error));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-semibold">Add New Image</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Drop zone */}
          <label className={`relative border-2 border-dashed rounded-sm cursor-pointer transition-colors ${
            preview ? "border-white/20" : "border-white/10 hover:border-white/30"
          }`}>
            {preview ? (
              <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="w-full h-full object-contain bg-neutral-800" />
                <div className="absolute top-2 right-2 text-[10px] text-neutral-400 bg-black/60 px-2 py-1">{file?.name}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Upload size={28} className="text-neutral-600" />
                <p className="text-sm text-neutral-500">Click to select image or drag & drop</p>
                <p className="text-xs text-neutral-700">JPG, PNG, WEBP</p>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Pattern Family *</label>
              <input required value={form.patternFamily} onChange={e => setForm(f => ({...f, patternFamily: e.target.value}))}
                placeholder="e.g. Lake, Billow, Chicago..."
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                placeholder="e.g. Lake — Backlit Healthcare"
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Application</label>
              <select value={form.application || ""} onChange={e => setForm(f => ({...f, application: e.target.value}))}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                <option value="">— Select Application —</option>
                {CANONICAL_APPLICATIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Sector</label>
              <select value={form.sector} onChange={e => setForm(f => ({...f, sector: e.target.value}))}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                {SECTORS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Corian Color</label>
              <select value={form.corianColor} onChange={e => setForm(f => ({...f, corianColor: e.target.value}))}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                {COLORS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Design Type</label>
              <select value={form.design_type} onChange={e => setForm(f => ({...f, design_type: e.target.value}))}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                <option value="Spec-Ready">Spec-Ready</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Keywords</label>
            <input value={form.keywords} onChange={e => setForm(f => ({...f, keywords: e.target.value}))}
              placeholder="organic,flowing,backlit,healthcare,calming..."
              className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600" />
          </div>

          <div>
            <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
              rows={2} placeholder="One or two sentences describing this image..."
              className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600 resize-none" />
          </div>

          <div>
            <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Project Name</label>
            <input value={form.project_name} onChange={e => setForm(f => ({...f, project_name: e.target.value}))}
              placeholder="e.g. Jefferson Health, LAX Terminal..."
              className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600" />
          </div>

          <div className="flex gap-4">
            {[
              { key: "isBacklit", label: "✦ Backlit / Illuminated" },
              { key: "is_hero", label: "★ Hero Image" },
              { key: "is_exterior", label: "⬡ Exterior" },
            ].map(({key, label}) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={(form as any)[key]}
                  onChange={e => setForm(f => ({...f, [key]: e.target.checked}))}
                  className="w-4 h-4 accent-amber-400" />
                <span className="text-xs text-neutral-300">{label}</span>
              </label>
            ))}
          </div>

          <button type="submit" disabled={uploading || saving || done}
            className={`py-3 text-xs font-bold tracking-widest uppercase transition-colors ${
              done ? "bg-green-500 text-black" :
              (uploading || saving) ? "bg-neutral-700 text-neutral-400" :
              "bg-white text-black hover:bg-amber-400"
            }`}>
            {done ? "✓ Saved!" : uploading ? "Uploading to Cloudinary..." : saving ? "Saving to Airtable..." : "Upload & Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────
function EditModal({ product, onClose, onSave, onDelete }: {
  product: Product;
  onClose: () => void;
  onSave: (id: string, fields: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [form, setForm] = useState({ ...product, cloudinaryUrl: product.cloudinaryUrl });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploadingTexture, setUploadingTexture] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    // Build fields — strip ALL empty strings (Airtable rejects "" for Single Select fields)
    const rawFields: any = {
      title: form.title,
      patternFamily: form.patternFamily,
      design_type: form.design_type,
      sector: form.sector,
      corianColor: form.corianColor,
      keywords: form.keywords,
      description: form.description,
      is_hero: form.is_hero,
      is_exterior: form.is_exterior,
      isBacklit: form.isBacklit,
      project_name: form.project_name,
      render_texture_url: form.render_texture_url,
      specReady: form.design_type === "Spec-Ready",
    };
    // Remove any null, undefined, or empty string values
    const fieldsToSave: any = {};
    Object.entries(rawFields).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {
        fieldsToSave[k] = v;
      }
    });
    if ((form as any).application) fieldsToSave.application = (form as any).application;
    // Checkboxes must always be included even when false
    fieldsToSave.is_hero = form.is_hero;
    fieldsToSave.is_exterior = form.is_exterior;
    fieldsToSave.isBacklit = form.isBacklit;
    fieldsToSave.applicationHero = (form as any).applicationHero || false;
    fieldsToSave.specReady = form.design_type === "Spec-Ready";

    try { await onSave(product.id, fieldsToSave);
    setSaving(false);
    setSaved(true);
    setForm(f => ({ ...f, is_hero: form.is_hero, is_exterior: form.is_exterior, render_texture_url: form.render_texture_url }));
    setTimeout(() => setSaved(false), 2000);
    } catch(e: any) { setSaving(false); setSaveError(e?.message || "Save failed"); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(product.id);
    onClose();
  };

  const uploadTexture = async (file: File) => {
    setUploadingTexture(true);
    try {
      // Build Cloudinary signed upload
      const family = (form.patternFamily || "custom").toLowerCase().replace(/\s+/g, "-");
      const publicId = `makereal/${family}/${family}-render-texture`;
      const ts = Math.floor(Date.now() / 1000).toString();
      // Get signature from our API
      const sigResp = await fetch("/api/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId, timestamp: ts }),
      });
      const { signature } = await sigResp.json();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", "744384844353185");
      fd.append("timestamp", ts);
      fd.append("public_id", publicId);
      fd.append("signature", signature);
      const upResp = await fetch("https://api.cloudinary.com/v1_1/dtlodxxio/image/upload", { method: "POST", body: fd });
      const data = await upResp.json();
      if (data.secure_url) {
        setForm(f => ({ ...f, render_texture_url: data.secure_url }));
      } else {
        alert("Upload failed: " + (data.error?.message || "unknown error"));
      }
    } catch (e) {
      alert("Upload error: " + e);
    }
    setUploadingTexture(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-white font-semibold">{product.title || product.patternFamily || "Unnamed"}</h2>
            <p className="text-[10px] text-neutral-500 mt-0.5">Family: {product.patternFamily || "—"} · {product.id}</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square bg-neutral-800">
            {product.cloudinaryUrl && (
              <Image src={product.cloudinaryUrl} alt="" fill className="object-cover" sizes="400px" />
            )}
          </div>

          {/* Fields */}
          <div className="p-5 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Title</label>
              <input value={form.title || ""} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                placeholder="e.g. Lake — Backlit Healthcare"
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600" />
            </div>

            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Pattern Family</label>
              <input value={form.patternFamily} onChange={e => setForm(f => ({...f, patternFamily: e.target.value}))}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30" />
            </div>

            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Design Type</label>
              <select value={form.design_type} onChange={e => setForm(f => ({...f, design_type: e.target.value}))}
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                <option value="Spec-Ready">Spec-Ready</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Application</label>
                <select value={(form as any).application || ""} onChange={e => setForm(f => ({...f, application: e.target.value}))}
                  className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                  <option value="">— Select Application —</option>
                  {CANONICAL_APPLICATIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Sector</label>
                <select value={form.sector || ""} onChange={e => setForm(f => ({...f, sector: e.target.value}))}
                  className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                  <option value="">— Select —</option>
                  {["Healthcare","Hospitality","Corporate","Education","Aviation","Multifamily","Residential","Retail","Cultural","General"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Corian Color</label>
                <select value={form.corianColor || ""} onChange={e => setForm(f => ({...f, corianColor: e.target.value}))}
                  className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30">
                  <option value="">— Select —</option>
                  {["Glacier White","Designer White","Arctic White","Linen","Bone","Cameo White","Seashell","Hemp","Cotton","Deep Nocturne"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isBacklit}
                    onChange={e => setForm(f => ({...f, isBacklit: e.target.checked}))}
                    className="w-4 h-4 accent-amber-400" />
                  <span className="text-xs text-neutral-300">✦ Backlit / Illuminated</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Project Name</label>
              <input value={form.project_name || ""} onChange={e => setForm(f => ({...f, project_name: e.target.value}))}
                placeholder="e.g. Jefferson Health"
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600" />
            </div>

            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Keywords</label>
              <textarea value={form.keywords || ""} onChange={e => setForm(f => ({...f, keywords: e.target.value}))}
                rows={2} placeholder="comma,separated,keywords"
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600 resize-none" />
            </div>

            <div>
              <label className="text-[10px] tracking-widest text-neutral-500 uppercase block mb-1">Description</label>
              <textarea value={form.description || ""} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                rows={3} placeholder="Human-readable description for the design page..."
                className="w-full bg-neutral-800 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/30 placeholder:text-neutral-600 resize-none" />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-4 flex-wrap">
              {[
                { key: "is_hero", label: "★ Hero Image" },
                { key: "is_exterior", label: "⬡ Exterior" },
                { key: "applicationHero", label: "⊞ Application Hero" },
              ].map(({key, label}) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!(form as any)[key]}
                    onChange={e => setForm(f => ({...f, [key]: e.target.checked}))}
                    className="w-4 h-4 accent-amber-400" />
                  <span className="text-xs text-neutral-300">{label}</span>
                </label>
              ))}
            </div>

            {/* AI Texture toggle */}
            <div className="border border-amber-400/20 bg-amber-400/5 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox"
                  checked={!!form.render_texture_url}
                  onChange={e => setForm(f => ({
                    ...f,
                    render_texture_url: e.target.checked ? f.cloudinaryUrl : ""
                  }))}
                  className="w-4 h-4 accent-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-400">✦ Enable as AI Generator Texture</p>
                  <p className="text-xs text-neutral-500 mt-0.5">This image will be used as the reference texture for the AI image generator for the <strong className="text-neutral-300">{form.patternFamily}</strong> pattern family. Only one image per family should be enabled.</p>
                </div>
              </label>
              {form.render_texture_url && (
                <div className="mt-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.cloudinaryUrl} alt="texture" className="h-14 w-14 object-cover rounded-sm flex-shrink-0" />
                  <p className="text-[10px] text-neutral-500 break-all">{form.cloudinaryUrl}</p>
                </div>
              )}
            </div>

            <button onClick={handleSave} disabled={saving}
              className={`mt-2 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors ${
                saved ? "bg-green-500 text-black" : "bg-white text-black hover:bg-amber-400"
              }`}>
              {saved ? "✓ Saved — close when ready" : saving ? "Saving..." : "Save Changes"}
            </button>
            {saveError && <p className="text-xs text-red-400 mt-1">{saveError}</p>}

            {/* Delete */}
            <button onClick={handleDelete} disabled={deleting}
              className={`py-2 text-xs font-medium tracking-widest uppercase transition-colors border ${
                confirmDelete
                  ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                  : "border-red-500/30 text-red-400 hover:border-red-500 hover:bg-red-500/10"
              }`}>
              {deleting ? "Deleting..." : confirmDelete ? "⚠ Click again to confirm delete" : "Delete Record"}
            </button>
            {confirmDelete && <p className="text-[10px] text-red-400/70 -mt-2">This removes the record from Airtable. The Cloudinary image is not deleted.</p>}
          </div>
        </div>

        {/* Cloudinary URL (read-only) */}
        <div className="p-4 border-t border-white/5">
          <p className="text-[9px] text-neutral-600 break-all">{product.cloudinaryUrl}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function AdminClient() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_auth") === "1";
    }
    return false;
  });
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterFamily, setFilterFamily] = useState("All");
  const [filterApp, setFilterApp] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "family" | "duplicates" | "app-heroes">("grid");
  const [duplicateIds, setDuplicateIds] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 60;

  const fetchAll = useCallback(async (bust = false) => {
    setLoading(true);
    try {
      const url = bust ? "/api/admin-products?bust=1" : "/api/admin-products";
      const resp = await fetch(url);
      const data = await resp.json();
      setProducts(data);
    } catch (e) {
      console.error("Failed to fetch:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  const saveProduct = async (id: string, fields: Partial<Product>) => {
    setSaving(id);
    const resp = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ records: [{ id, fields }] }),
    });
    const result = await resp.json();
    if (result.error) {
      console.error("Save error:", result.error);
      alert("Save failed: " + result.error.message);
    } else {
      // ALWAYS use the fields WE sent to update local state.
      // Airtable omits false/empty from its response — never trust the response for checkboxes.
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p));
    }
    setSaving(null);
  };

  const deleteProduct = async (id: string) => {
    await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const findDuplicates = () => {
    const urlMap: Record<string, string[]> = {};
    const titleMap: Record<string, string[]> = {};
    const dupes = new Set<string>();

    // Group by Cloudinary URL (exact duplicates)
    products.forEach(p => {
      if (!p.cloudinaryUrl) return;
      if (!urlMap[p.cloudinaryUrl]) urlMap[p.cloudinaryUrl] = [];
      urlMap[p.cloudinaryUrl].push(p.id);
    });
    Object.values(urlMap).forEach(ids => {
      if (ids.length > 1) ids.forEach(id => dupes.add(id));
    });

    // Group by family + normalized title (near-duplicates)
    products.forEach(p => {
      const key = `${p.patternFamily}||${(p.title || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "")}`;
      if (!titleMap[key]) titleMap[key] = [];
      titleMap[key].push(p.id);
    });
    Object.values(titleMap).forEach(ids => {
      if (ids.length > 1) ids.forEach(id => dupes.add(id));
    });

    setDuplicateIds(dupes);
    setViewMode("duplicates");
    resetPage();
  };

  const toggleHero = async (product: Product) => {
    const newVal = !product.is_hero;
    await saveProduct(product.id, { is_hero: newVal } as any);
  };

  const toggleExterior = async (product: Product) => {
    const newVal = !product.is_exterior;
    await saveProduct(product.id, { is_exterior: newVal } as any);
  };

  // Reset page when filters change
  const resetPage = () => setPage(0);

  // Filter + search
  const families = ["All", ...Array.from(new Set(products.map(p => p.patternFamily).filter(Boolean))).sort()];
  const ADMIN_APP_FILTERS = ["All", "Elevator Lobby", "Feature Wall", "Reception", "Reception Desk", "Grand Entry", "Hallway", "Ceiling", "Branding", "Facade", "Water Feature"];

  const filtered = products.filter(p => {
    if (!p.cloudinaryUrl) return false;
    if (filterType !== "All" && p.design_type !== filterType) return false;
    if (filterFamily !== "All" && p.patternFamily !== filterFamily) return false;
    if (filterApp !== "All") {
      const app = ((p as any).application || "").trim().toLowerCase();
      if (app !== filterApp.toLowerCase()) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return p.patternFamily?.toLowerCase().includes(q) ||
             p.title?.toLowerCase().includes(q) ||
             p.keywords?.toLowerCase().includes(q) ||
             p.project_name?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Auth gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-80">
          <p className="text-white font-bold text-lg mb-6 text-center">M|R Walls Admin</p>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && password === ADMIN_PASSWORD) { sessionStorage.setItem("admin_auth", "1"); setAuthed(true); } }}
            className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm mb-3 focus:outline-none focus:border-white/30" />
          <button onClick={() => {
            if (password === ADMIN_PASSWORD) {
              sessionStorage.setItem("admin_auth", "1");
              setAuthed(true);
            }
          }}
            className="w-full py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-amber-400 transition-colors">
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Header */}
      <div className="bg-neutral-950 border-b border-white/5 sticky top-16 z-30 px-5 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold tracking-widest uppercase">Product Library</h1>
            <span className="text-[10px] text-neutral-500">{filtered.length} / {products.length} records · page {page+1}/{totalPages || 1}</span>
            {loading && <span className="text-[10px] text-amber-400 animate-pulse">Loading...</span>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search family, keyword, project..."
                className="bg-neutral-800 border border-white/10 text-white text-xs pl-8 pr-4 py-2 w-64 focus:outline-none focus:border-white/30 placeholder:text-neutral-600" />
            </div>
            {/* Type filter */}
            {["All", "Spec-Ready", "Studio"].map(t => (
              <button key={t} onClick={() => { setFilterType(t); resetPage(); }}
                className={`px-3 py-1.5 text-[10px] tracking-widest uppercase border transition-colors ${
                  filterType === t ? "border-white bg-white text-black" : "border-white/15 text-neutral-400 hover:border-white/40"
                }`}>{t}</button>
            ))}
            {/* Family filter */}
            <select value={filterFamily} onChange={e => { setFilterFamily(e.target.value); resetPage(); }}
              className="bg-neutral-800 border border-white/10 text-white text-xs px-3 py-2 focus:outline-none max-w-[160px]">
              {families.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {/* View toggle */}
            <div className="flex border border-white/15 overflow-hidden">
              {(["grid", "family"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 text-[10px] tracking-widest uppercase transition-colors ${
                    viewMode === v ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                  }`}>
                  {v === "grid" ? "⊞ Grid" : "⊟ By Family"}
                </button>
              ))}
            </div>
            <button onClick={findDuplicates}
              className={`px-3 py-1.5 text-[10px] tracking-widest uppercase border transition-colors ${
                viewMode === "duplicates" ? "border-red-400 bg-red-400/10 text-red-400" : "border-white/15 text-neutral-400 hover:border-red-400/50 hover:text-red-400"
              }`}>
              ⚡ Find Duplicates {duplicateIds.size > 0 && `(${duplicateIds.size})`}
            </button>
            <button onClick={() => setViewMode("app-heroes")}
              className={`px-3 py-1.5 text-[10px] tracking-widest uppercase border transition-colors ${
                viewMode === "app-heroes" ? "border-blue-400 bg-blue-400/10 text-blue-400" : "border-white/15 text-neutral-400 hover:border-blue-400/50 hover:text-blue-400"
              }`}>
              ⊞ Application Heroes
            </button>
            {/* Application filter */}
            <select value={filterApp} onChange={e => setFilterApp(e.target.value)}
              className="bg-neutral-800 border border-white/10 text-white text-xs px-3 py-2 focus:outline-none max-w-[160px]">
              {ADMIN_APP_FILTERS.map(f => <option key={f} value={f}>{f === "All" ? "All Applications" : f}</option>)}
            </select>
            <button onClick={() => fetchAll(true)} className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-white/15 text-neutral-400 hover:border-white/40 hover:text-white">
              ↺ Refresh
            </button>
            <button onClick={() => setAddingNew(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] tracking-widest uppercase bg-amber-400 text-black font-bold hover:bg-amber-300 transition-colors">
              <Plus size={12} /> Add New
            </button>
          </div>
        </div>
      </div>

      {/* Application Heroes View */}
      {viewMode === "app-heroes" && (() => {
        const CANONICAL_APPS = [
          "Elevator Lobby", "Feature Wall", "Reception", "Reception Desk",
          "Grand Entry", "Ceiling", "Hallway", "Branding", "Facade", "Water Feature"
        ];
        
        // Group applicationHero records by application
        const appHeroMap: Record<string, any[]> = {};
        CANONICAL_APPS.forEach(a => { appHeroMap[a] = []; });
        
        products.forEach(p => {
          if ((p as any).applicationHero) {
            const app = ((p as any).application || "").trim();
            if (app && appHeroMap[app] !== undefined) {
              appHeroMap[app].push(p);
            } else if (app) {
              // application set but not in canonical list
              if (!appHeroMap["(Other)"]) appHeroMap["(Other)"] = [];
              appHeroMap["(Other)"].push(p);
            } else {
              // applicationHero=true but no application set
              if (!appHeroMap["(No Application)"]) appHeroMap["(No Application)"] = [];
              appHeroMap["(No Application)"].push(p);
            }
          }
        });

        return (
          <div className="max-w-screen-2xl mx-auto px-5 py-6">
            <p className="text-sm text-neutral-500 mb-6">
              Each application should have exactly one ⊞ hero image set. 
              <span className="text-green-400 ml-2">Green = 1 hero ✓</span>
              <span className="text-red-400 ml-2">Red = multiple heroes ✗</span>
              <span className="text-yellow-400 ml-2">Yellow = no hero</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Object.entries(appHeroMap).map(([app, heroes]) => {
                const isGood = heroes.length === 1;
                const isMultiple = heroes.length > 1;
                const isEmpty = heroes.length === 0;
                const borderColor = isGood ? "border-green-400/40" : isMultiple ? "border-red-400/60" : "border-yellow-400/30";
                const bgColor = isGood ? "bg-green-400/5" : isMultiple ? "bg-red-400/5" : "bg-yellow-400/5";
                const statusText = isGood ? "✓ 1 hero" : isMultiple ? `✗ ${heroes.length} heroes!` : "⚠ No hero";
                const statusColor = isGood ? "text-green-400" : isMultiple ? "text-red-400" : "text-yellow-400";

                return (
                  <div key={app} className={`border ${borderColor} ${bgColor} p-0 overflow-hidden`}>
                    {/* Header */}
                    <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                      <p className="text-[11px] font-bold text-white truncate">{app}</p>
                      <span className={`text-[10px] font-bold ${statusColor} flex-shrink-0 ml-2`}>{statusText}</span>
                    </div>
                    
                    {/* Hero image(s) */}
                    {heroes.length === 0 ? (
                      <div className="aspect-[4/3] bg-neutral-900 flex items-center justify-center">
                        <p className="text-[10px] text-yellow-400/60 text-center px-3">No ⊞ Application Hero set<br/>Tag one in admin</p>
                      </div>
                    ) : (
                      <div className={heroes.length > 1 ? "grid grid-cols-2 gap-px bg-red-900/20" : ""}>
                        {heroes.map((p, i) => (
                          <div key={p.id} className="relative cursor-pointer group" onClick={() => setEditing(p)}
                            style={{aspectRatio: heroes.length > 1 ? "1/1" : "4/3"}}>
                            {p.cloudinaryUrl && (
                              <Image src={p.cloudinaryUrl} alt="" fill className="object-cover" sizes="20vw" />
                            )}
                            {/* Blue hero badge */}
                            <div className="absolute top-1.5 left-1.5 text-[8px] font-bold bg-blue-400 text-black px-1.5 py-0.5">⊞ HERO</div>
                            {isMultiple && (
                              <div className="absolute top-1.5 right-1.5 text-[8px] font-bold bg-red-500 text-white px-1.5 py-0.5">DUPLICATE</div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[9px] text-white truncate">{p.title || p.patternFamily}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Quick action */}
                    {isMultiple && (
                      <div className="px-3 py-1.5 bg-red-900/20 text-[9px] text-red-400">
                        Click to open → uncheck ⊞ on duplicates
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Duplicates View */}
      {viewMode === "duplicates" && (
        <div className="max-w-screen-2xl mx-auto px-5 py-6">
          {duplicateIds.size === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl mb-2">✓</p>
              <p className="text-white font-semibold mb-1">No duplicates found!</p>
              <p className="text-neutral-500 text-sm">{products.length} records, all unique.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 border border-red-400/20 bg-red-400/5">
                <p className="text-red-400 text-sm font-semibold mb-1">⚡ {duplicateIds.size} suspected duplicates found</p>
                <p className="text-neutral-500 text-xs">Records with the same Cloudinary URL or same family + title. Review and delete the duplicates below.</p>
              </div>
              {/* Group duplicates by URL */}
              {(() => {
                const urlGroups: Record<string, Product[]> = {};
                const titleGroups: Record<string, Product[]> = {};
                products.filter(p => duplicateIds.has(p.id)).forEach(p => {
                  if (p.cloudinaryUrl) {
                    if (!urlGroups[p.cloudinaryUrl]) urlGroups[p.cloudinaryUrl] = [];
                    urlGroups[p.cloudinaryUrl].push(p);
                  }
                  const tk = `${p.patternFamily}||${(p.title||"").toLowerCase().trim().replace(/[^a-z0-9]/g,"")}`;
                  if (!titleGroups[tk]) titleGroups[tk] = [];
                  titleGroups[tk].push(p);
                });

                const groups: Product[][] = [];
                const seen = new Set<string>();
                // URL duplicates
                Object.values(urlGroups).filter(g => g.length > 1).forEach(g => {
                  const key = g.map(p=>p.id).sort().join();
                  if (!seen.has(key)) { seen.add(key); groups.push(g); }
                });
                // Title near-duplicates
                Object.values(titleGroups).filter(g => g.length > 1).forEach(g => {
                  const key = g.map(p=>p.id).sort().join();
                  if (!seen.has(key)) { seen.add(key); groups.push(g); }
                });

                return (
                  <div className="space-y-6">
                    {groups.map((group, gi) => (
                      <div key={gi} className="border border-red-400/15 bg-neutral-950">
                        <div className="px-4 py-2 border-b border-red-400/10 flex items-center justify-between">
                          <p className="text-[10px] tracking-widest text-red-400 uppercase">
                            {group[0].cloudinaryUrl === group[1]?.cloudinaryUrl ? "⚡ Same Image URL" : "⚡ Same Family + Title"}
                          </p>
                          <p className="text-[10px] text-neutral-600">{group.length} records</p>
                        </div>
                        <div className="flex gap-px bg-neutral-800">
                          {group.map(p => (
                            <div key={p.id} className="flex-1 bg-neutral-950 cursor-pointer hover:bg-neutral-900" onClick={() => setEditing(p)}>
                              <div className="relative aspect-square overflow-hidden bg-neutral-800">
                                {p.cloudinaryUrl && <Image src={p.cloudinaryUrl} alt="" fill className="object-cover" sizes="20vw" />}
                                {p.is_hero && <div className="absolute top-1 left-1 text-[8px] bg-amber-400 text-black px-1 font-bold">★</div>}
                              </div>
                              <div className="p-3">
                                <p className="text-[10px] text-white truncate">{p.title || p.patternFamily || "—"}</p>
                                <p className="text-[9px] text-neutral-600 truncate mt-0.5">{p.id}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* Family View */}
      {viewMode === "family" && (() => {
        // Group filtered products by family
        const grouped: Record<string, Product[]> = {};
        filtered.forEach(p => {
          const fam = (p.patternFamily || "No Family").trim();
          if (!grouped[fam]) grouped[fam] = [];
          grouped[fam].push(p);
        });
        const sortedFamilies = Object.keys(grouped).sort();

        return (
          <div className="max-w-screen-2xl mx-auto px-5 py-6 space-y-10">
            {sortedFamilies.map(fam => {
              const items = grouped[fam];
              const heroes = items.filter(p => p.is_hero);
              const textures = items.filter(p => p.render_texture_url);
              const hasHeroIssue = heroes.length !== 1;
              const hasTextureIssue = textures.length > 1;
              const hasMissingTexture = textures.length === 0;

              return (
                <div key={fam}>
                  {/* Family header */}
                  <div className="flex items-center gap-4 mb-3 pb-2 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white">{fam}</h3>
                    <span className="text-[10px] text-neutral-600">{items.length} image{items.length !== 1 ? "s" : ""}</span>
                    {/* Status badges */}
                    {hasHeroIssue && (
                      <span className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest ${
                        heroes.length === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {heroes.length === 0 ? "★ No hero" : `★ ${heroes.length} heroes`}
                      </span>
                    )}
                    {!hasHeroIssue && <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-400 uppercase tracking-widest">★ Hero OK</span>}
                    {hasTextureIssue && <span className="text-[9px] px-2 py-0.5 bg-red-500/20 text-red-400 font-bold uppercase tracking-widest">✦ {textures.length} textures</span>}
                    {!hasTextureIssue && !hasMissingTexture && <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-400 uppercase tracking-widest">✦ Texture OK</span>}
                    {hasMissingTexture && <span className="text-[9px] px-2 py-0.5 bg-neutral-800 text-neutral-500 uppercase tracking-widest">✦ No texture</span>}
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                    {items.map(p => (
                      <div key={p.id}
                        className={`group relative bg-neutral-950 border cursor-pointer transition-colors ${
                          p.is_hero ? "border-amber-400/60" : p.render_texture_url ? "border-amber-400/30" : "border-white/5 hover:border-white/20"
                        }`}
                        onClick={() => setEditing(p)}>
                        <div className="relative aspect-square overflow-hidden bg-neutral-800">
                          {p.cloudinaryUrl ? (
                            <Image src={p.cloudinaryUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="10vw" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-700 text-[9px]">no img</div>
                          )}
                          {p.is_hero && <div className="absolute top-1 left-1 text-[8px] bg-amber-400 text-black px-1 font-bold">★</div>}
                          {p.render_texture_url && <div className="absolute top-1 right-1 text-[8px] bg-amber-400/80 text-black px-1">✦</div>}
                          {saving === p.id && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[9px] text-amber-400">saving</div>}
                        </div>
                        {/* Quick toggles */}
                        <div className="flex border-t border-white/5">
                          <button onClick={e => { e.stopPropagation(); toggleHero(p); }}
                            title="Toggle hero"
                            className={`flex-1 py-1 text-[9px] border-r border-white/5 transition-colors ${p.is_hero ? "text-amber-400" : "text-neutral-700 hover:text-amber-400"}`}>★</button>
                          <button onClick={async e => {
                            e.stopPropagation();
                            const newVal = p.render_texture_url ? "" : p.cloudinaryUrl;
                            await saveProduct(p.id, { render_texture_url: newVal } as any);
                          }}
                            title="Toggle AI texture"
                            className={`flex-1 py-1 text-[9px] transition-colors ${p.render_texture_url ? "text-amber-400" : "text-neutral-700 hover:text-amber-400"}`}>✦</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Grid */}
      {viewMode === "grid" && (
      <div className="max-w-screen-2xl mx-auto px-5 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {paged.map(p => (
            <div key={p.id} className={`group relative bg-neutral-950 border transition-colors ${
              p.patternFamily === "Custom" || !p.patternFamily ? "border-yellow-500/30" : "border-white/5 hover:border-white/20"
            }`}>
              {/* Image */}
              <div className="relative aspect-square bg-neutral-800 overflow-hidden cursor-pointer" onClick={() => setEditing(p)}>
                {p.cloudinaryUrl ? (
                  <Image src={p.cloudinaryUrl} alt={p.patternFamily || "Product"} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 16vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-700 text-xs">No image</div>
                )}
                {/* Badges */}
                {p.is_hero && <div className="absolute top-1 left-1 text-[8px] bg-amber-400 text-black px-1.5 py-0.5 font-bold">★ HERO</div>}
                {p.isBacklit && <div className="absolute top-1 right-1 text-[8px] bg-amber-400/80 text-black px-1.5 py-0.5">✦</div>}
                {p.is_exterior && <div className="absolute bottom-1 right-1 text-[8px] bg-blue-400/80 text-black px-1.5 py-0.5">EXT</div>}
                {/* Edit overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Edit3 size={18} className="text-white" />
                </div>
                {saving === p.id && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-amber-400">Saving...</div>}
              </div>

              {/* Info */}
              <div className="p-2">
                <p className={`text-[11px] font-medium truncate mb-1 ${
                  p.patternFamily === "Custom" || !p.patternFamily ? "text-yellow-400" : "text-white"
                }`}>{p.patternFamily || "⚠ No family"}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] px-1.5 py-0.5 ${
                    p.design_type === "Spec-Ready" ? "bg-green-900/50 text-green-400" : "bg-blue-900/50 text-blue-400"
                  }`}>{p.design_type || "—"}</span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleHero(p)} title="Toggle hero"
                      className={`text-[9px] px-1 py-0.5 border transition-colors ${
                        p.is_hero ? "border-amber-400 text-amber-400" : "border-white/10 text-neutral-600 hover:border-amber-400/40"
                      }`}>★</button>
                    <button onClick={() => toggleExterior(p)} title="Toggle exterior"
                      className={`text-[9px] px-1 py-0.5 border transition-colors ${
                        p.is_exterior ? "border-blue-400 text-blue-400" : "border-white/10 text-neutral-600 hover:border-blue-400/40"
                      }`}>⬡</button>
                  </div>
                </div>
                {p.project_name && <p className="text-[9px] text-neutral-600 truncate mt-0.5">{p.project_name}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Pagination — grid view only */}
      {viewMode === "grid" && totalPages > 1 && (
        <div className="max-w-screen-2xl mx-auto px-5 pb-10 flex items-center gap-3 justify-center">
          <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}
            className="px-4 py-2 text-xs border border-white/15 text-neutral-400 hover:border-white/40 disabled:opacity-30">
            ← Prev
          </button>
          <span className="text-xs text-neutral-500">{page+1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page === totalPages-1}
            className="px-4 py-2 text-xs border border-white/15 text-neutral-400 hover:border-white/40 disabled:opacity-30">
            Next →
          </button>
        </div>
      )}

      {/* Edit modal */}
      {addingNew && (
        <AddNewModal
          onClose={() => setAddingNew(false)}
          onAdd={(rec) => setProducts(prev => [rec, ...prev])}
        />
      )}

      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onDelete={async (id) => {
            await deleteProduct(id);
            setEditing(null);
          }}
          onSave={async (id, fields) => {
            await saveProduct(id, fields);
            setEditing(prev => prev ? { ...prev, ...fields } : null);
          }}
        />
      )}
    </div>
  );
}
