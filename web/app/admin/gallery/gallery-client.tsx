"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Upload, Loader2, Plus, X, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    createdAt: string;
}

const CATEGORIES = [
    "Temple Events",
    "Deity Darshan",
    "Annadanam",
    "Cultural Programs",
    "Social Welfare"
];

export default function GalleryManagementClient({ initialImages }: { initialImages: GalleryImage[] }) {
    const [images, setImages] = useState<GalleryImage[]>(initialImages);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [uploadForm, setUploadForm] = useState({
        title: "",
        category: CATEGORIES[0],
        file: null as File | null
    });
    const [showUploadModal, setShowUploadModal] = useState(false);

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!uploadForm.file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", uploadForm.file);
        formData.append("title", uploadForm.title);
        formData.append("category", uploadForm.category);

        try {
            const res = await fetch("/api/admin/gallery", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            const newImage = await res.json();
            setImages([newImage, ...images]);
            setShowUploadModal(false);
            setUploadForm({ title: "", category: CATEGORIES[0], file: null });
            router.refresh();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this image?")) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/gallery?id=${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Delete failed");

            setImages(images.filter(img => img.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete image");
        } finally {
            setIsDeleting(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">Gallery Management</h2>
                    <p className="text-primary/60 mt-1">
                        Manage gallery images, categories, and uploads
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 bg-secondary text-surface-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition-colors font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    Add New Image
                </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image) => (
                    <div key={image.id} className="group relative bg-surface-white rounded-xl shadow-md overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 hover:shadow-lg transition-all">
                        <div className="aspect-square relative">
                            <Image
                                src={image.imageUrl}
                                alt={image.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    disabled={isDeleting === image.id}
                                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                                >
                                    {isDeleting === image.id ? <Loader2 className="w-6 h-6 animate-spin" /> : <Trash2 className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-cinzel-decorative font-bold text-primary-dark truncate mb-1">{image.title}</h3>
                            <span className="text-xs font-semibold text-secondary-dark bg-secondary/10 px-3 py-1 rounded-full inline-block">
                                {image.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 text-primary/60 bg-surface-white rounded-xl border-2 border-dashed border-secondary/20">
                    <p className="font-serif">No images found. Upload one to get started.</p>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
                    <div className="bg-surface-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border-2 border-secondary/20">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-4 right-4 text-primary/60 hover:text-primary-dark transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-xl font-cinzel-decorative font-bold text-primary-dark mb-6">Upload New Image</h3>

                        <form onSubmit={handleUpload} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none bg-background-cream/50"
                                    placeholder="e.g. Temple Celebration"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">Category</label>
                                <select
                                    value={uploadForm.category}
                                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none bg-background-cream/50"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">Image</label>
                                <div className="border-2 border-dashed border-secondary/30 rounded-lg p-8 text-center hover:bg-secondary/5 transition-colors cursor-pointer bg-background-cream/30"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {uploadForm.file ? (
                                        <div className="text-sm text-secondary-dark font-medium flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            {uploadForm.file.name}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-primary/40">
                                            <Upload className="w-10 h-10 mb-3 text-secondary/40" />
                                            <span className="text-sm font-medium">Click to select image</span>
                                            <span className="text-xs mt-1">JPG, PNG up to 5MB</span>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setUploadForm({ ...uploadForm, file: e.target.files[0] });
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-2 border-2 border-secondary/30 text-primary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading || !uploadForm.file}
                                    className="flex-1 bg-secondary text-surface-white py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
