import { Check, Plus, Save, X } from "lucide-react"
import type { ReactNode } from "react"
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form"
import type { Genre } from "@/interfaces"
import type { TmdbMovieDto } from "@/interfaces/dto/tmdb.dto"
import type { MovieAdmin } from "@/interfaces/entities/movie.interface"
import { MovieSearchInput } from "./MovieSearchInput"

export type MovieFormValues = {
    title: string
    description: string
    durationMinutes: number
    thumbnailUrl: string
    backdropUrl: string
    videoUrl: string
    releaseYear: number
    rating: number
    genres: Genre[]
    isTrending: boolean
    isHero?: boolean
    isActive?: boolean
    cast: string[]
    crew: string[]
    newCastMember: string
    newCrewMember: string
}

type MovieFormProps = {
    mode: "create" | "edit"
    movie?: Partial<MovieAdmin>
    genres: Genre[]
    isPosting: boolean
    onSubmit: (data: MovieFormValues) => Promise<void>
    onCancel: () => void
    onSelectMovie?: (movie: TmdbMovieDto) => Promise<Partial<MovieFormValues> | void>
}

export const MovieForm = ({
    mode,
    movie,
    genres,
    isPosting,
    onSubmit,
    onCancel,
    onSelectMovie,
}: MovieFormProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues
    } = useForm<MovieFormValues>({
        defaultValues: {
            title: movie?.title || "",
            description: movie?.description || "",
            durationMinutes: movie?.durationMinutes || 0,
            thumbnailUrl: movie?.thumbnailUrl || "",
            backdropUrl: movie?.backdropUrl || "",
            videoUrl: movie?.videoUrl || "https://www.example.com/video.mp4",
            releaseYear: movie?.releaseYear || 0,
            rating: movie?.rating || 0,
            genres: movie?.genres || [],
            isTrending: movie?.isTrending || false,
            isHero: movie?.isHero || false,
            isActive: movie?.isActive ?? true,
            cast: movie?.cast || [],
            crew: movie?.crew || [],
            newCastMember: "",
            newCrewMember: "",
        }
    })

    const formValues = useWatch({ control })
    const selectedGenres = (formValues.genres as Genre[] | undefined) || []
    const cast = (formValues.cast as string[] | undefined) || []
    const crew = (formValues.crew as string[] | undefined) || []
    const posterUrl = formValues.thumbnailUrl
    const backdropUrl = formValues.backdropUrl

    const handleAddItem = (field: "cast" | "crew", inputField: "newCastMember" | "newCrewMember") => {
        const newValue = getValues(inputField)?.trim()
        if (!newValue) return

        setValue(field, [...(getValues(field) || []), newValue], { shouldDirty: true })
        setValue(inputField, "")
    }

    const handleRemoveItem = (field: "cast" | "crew", index: number) => {
        const updated = (getValues(field) || []).filter((_, itemIndex) => itemIndex !== index)
        setValue(field, updated, { shouldDirty: true })
    }

    const toggleGenre = (genre: Genre) => {
        const isSelected = selectedGenres.some(selectedGenre => selectedGenre.id === genre.id)
        const updatedGenres = isSelected
            ? selectedGenres.filter(selectedGenre => selectedGenre.id !== genre.id)
            : [...selectedGenres, genre]

        setValue("genres", updatedGenres, { shouldDirty: true })
    }

    const handleMovieImport = async (tmdbMovie: TmdbMovieDto) => {
        if (!onSelectMovie) return

        const importedValues = await onSelectMovie(tmdbMovie)
        if (!importedValues) return

        const importableFields: (keyof MovieFormValues)[] = [
            "title",
            "description",
            "durationMinutes",
            "thumbnailUrl",
            "backdropUrl",
            "releaseYear",
            "rating",
            "genres",
            "isTrending",
            "cast",
            "crew",
        ]

        importableFields.forEach((field) => {
            if (field in importedValues) {
                setValue(field, importedValues[field] as MovieFormValues[typeof field], { shouldDirty: true })
            }
        })
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {mode === "create" && onSelectMovie && (
                    <section className="rounded-md border border-white/10 bg-white/5 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                            Import
                        </p>
                        <MovieSearchInput onSelect={handleMovieImport} />
                    </section>
                )}

                <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                    <SectionHeader eyebrow="Details" title="Core information" />

                    <div className="mt-6 space-y-5">
                        <Field label="Title *" error={errors.title?.message}>
                            <input
                                type="text"
                                required
                                placeholder="Enter movie title"
                                className={inputClass}
                                {...register("title", { required: "Title is required" })}
                            />
                        </Field>

                        <Field label="Description *" error={errors.description?.message}>
                            <textarea
                                required
                                rows={5}
                                placeholder="Enter movie description"
                                className={`${inputClass} resize-none`}
                                {...register("description", { required: "Description is required" })}
                            />
                        </Field>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Field label="Release year *" error={errors.releaseYear?.message}>
                                <input
                                    type="number"
                                    required
                                    className={inputClass}
                                    {...register("releaseYear", {
                                        required: "Release year is required",
                                        min: { value: 1888, message: "Release year must be 1888 or later" },
                                        max: {
                                            value: new Date().getFullYear(),
                                            message: "Release year cannot be in the future"
                                        },
                                        valueAsNumber: true,
                                    })}
                                />
                            </Field>

                            <Field label="Rating *" error={errors.rating?.message}>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="10"
                                    step="0.0001"
                                    placeholder="8.5"
                                    className={inputClass}
                                    {...register("rating", {
                                        required: "Rating is required",
                                        min: { value: 0, message: "Rating must be 0 or higher" },
                                        max: { value: 10, message: "Rating must be 10 or lower" },
                                        validate: (value) =>
                                            /^\d+(\.\d{1,4})?$/.test(value.toString()) || "Maximum 4 decimals",
                                        valueAsNumber: true,
                                    })}
                                />
                            </Field>

                            <Field label="Duration *" error={errors.durationMinutes?.message}>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="120"
                                    className={inputClass}
                                    {...register("durationMinutes", {
                                        required: "Duration is required",
                                        min: { value: 0, message: "Duration must be positive" },
                                        valueAsNumber: true,
                                    })}
                                />
                            </Field>
                        </div>
                    </div>
                </section>

                <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                    <SectionHeader eyebrow="Media" title="Assets and playback" />

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <Field label="Poster URL *" error={errors.thumbnailUrl?.message}>
                            <input
                                type="url"
                                readOnly={mode === "create"}
                                placeholder="https://example.com/poster.jpg"
                                className={mode === "create" ? readonlyInputClass : inputClass}
                                {...register("thumbnailUrl", {
                                    required: "Poster URL is required",
                                })}
                            />
                        </Field>

                        <Field label="Backdrop URL *" error={errors.backdropUrl?.message}>
                            <input
                                type="url"
                                readOnly={mode === "create"}
                                placeholder="https://example.com/backdrop.jpg"
                                className={mode === "create" ? readonlyInputClass : inputClass}
                                {...register("backdropUrl", {
                                    required: "Backdrop URL is required",
                                })}
                            />
                        </Field>

                        <div className="md:col-span-2">
                            <Field label="URL del Trailer o Video (YouTube / MP4) *" error={errors.videoUrl?.message}>
                                <input
                                    type="url"
                                    placeholder="https://www.youtube.com/watch?v=... o https://servidor.com/video.mp4"
                                    className={inputClass}
                                    {...register("videoUrl", {
                                        required: "La URL del video o trailer es obligatoria",
                                    })}
                                />
                                <p className="mt-1.5 text-xs text-white/40">
                                    Acepta cualquier enlace de trailer de YouTube (ej. <code>youtu.be/...</code> o <code>youtube.com/watch?v=...</code>) o archivo de video directo (MP4/WebM).
                                </p>
                            </Field>
                        </div>
                    </div>
                </section>

                <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                    <SectionHeader eyebrow="Classification" title="Genres and status" />

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className={labelClass}>Genres *</label>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {genres.map((genre) => {
                                    const isSelected = selectedGenres.some(selectedGenre => selectedGenre.id === genre.id)

                                    return (
                                        <button
                                            key={genre.id}
                                            type="button"
                                            onClick={() => toggleGenre(genre)}
                                            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${isSelected
                                                ? "border-white bg-white text-black"
                                                : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
                                            }`}
                                        >
                                            {genre.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            <label className={toggleClass}>
                                <input type="checkbox" className="sr-only" {...register("isTrending")} />
                                <span className="flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/10">
                                    {formValues.isTrending && <Check className="h-3.5 w-3.5" />}
                                </span>
                                <span>Mark as trending</span>
                            </label>

                            <label className={toggleClass}>
                                <input type="checkbox" className="sr-only" {...register("isHero")} />
                                <span className="flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/10">
                                    {formValues.isHero && <Check className="h-3.5 w-3.5 text-amber-400" />}
                                </span>
                                <span className="flex items-center gap-1 text-amber-300">
                                    ⭐ Destacar como Hero
                                </span>
                            </label>

                            {mode === "edit" && (
                                <label className={toggleClass}>
                                    <input type="checkbox" className="sr-only" {...register("isActive")} />
                                    <span className="flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-white/10">
                                        {formValues.isActive && <Check className="h-3.5 w-3.5" />}
                                    </span>
                                    <span>Active in catalog</span>
                                </label>
                            )}
                        </div>
                    </div>
                </section>

                <PeopleSection
                    title="Cast"
                    values={cast}
                    inputRegistration={register("newCastMember")}
                    inputPlaceholder="Add cast member name"
                    onAdd={() => handleAddItem("cast", "newCastMember")}
                    onRemove={(index) => handleRemoveItem("cast", index)}
                />

                <PeopleSection
                    title="Crew"
                    values={crew}
                    inputRegistration={register("newCrewMember")}
                    inputPlaceholder="Add crew member name"
                    onAdd={() => handleAddItem("crew", "newCrewMember")}
                    onRemove={(index) => handleRemoveItem("crew", index)}
                />

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={isPosting}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {mode === "create" ? "Create Movie" : "Update Movie"}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/15"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
                <div className="overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                    <div className="relative aspect-video bg-white/5">
                        {backdropUrl ? (
                            <img src={backdropUrl} alt="Backdrop preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-white/40">
                                No backdrop
                            </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-[#08090b] via-transparent to-transparent" />
                    </div>
                    <div className="p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                            Preview
                        </p>
                        <h3 className="mt-2 truncate text-lg font-semibold text-white">
                            {formValues.title || "Untitled movie"}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">
                            {formValues.description || "Movie description will appear here."}
                        </p>
                    </div>
                </div>

                <div className="rounded-md border border-white/10 bg-white/5 p-4">
                    <div className="flex gap-3">
                        <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5">
                            {posterUrl ? (
                                <img src={posterUrl} alt="Poster preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-white/40">
                                    Poster
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 text-sm text-white/60">
                            <p>{formValues.releaseYear || "Year"} / {formValues.durationMinutes || 0} min</p>
                            <p className="mt-2">Rating {formValues.rating || 0}</p>
                            <p className="mt-2 truncate">
                                {selectedGenres.map(genre => genre.name).join(", ") || "No genres selected"}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

type FieldProps = {
    label: string
    error?: string
    children: ReactNode
}

const Field = ({ label, error, children }: FieldProps) => (
    <div>
        <label className={labelClass}>{label}</label>
        <div className="mt-2">{children}</div>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
)

const SectionHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
    <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-normal text-white">
            {title}
        </h2>
    </div>
)

type PeopleSectionProps = {
    title: string
    values: string[]
    inputRegistration: UseFormRegisterReturn
    inputPlaceholder: string
    onAdd: () => void
    onRemove: (index: number) => void
}

const PeopleSection = ({ title, values, inputRegistration, inputPlaceholder, onAdd, onRemove }: PeopleSectionProps) => (
    <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <SectionHeader eyebrow="People" title={title} />

        <div className="mt-6 flex gap-2">
            <input
                type="text"
                placeholder={inputPlaceholder}
                className={inputClass}
                {...inputRegistration}
            />
            <button
                type="button"
                onClick={onAdd}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/15"
            >
                <Plus className="h-4 w-4" />
            </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
            {values.length === 0 && (
                <p className="text-sm text-white/50">
                    No entries yet.
                </p>
            )}

            {values.map((member, index) => (
                <div
                    key={`${member}-${index}`}
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#08090b]/60 px-3 py-2"
                >
                    <span className="text-sm text-white/80">{member}</span>
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="text-white/50 transition hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    </section>
)

const labelClass = "block text-sm font-medium text-white/80"
const inputClass = "w-full rounded-md border border-white/10 bg-[#08090b]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-white/40 focus:bg-[#08090b]"
const readonlyInputClass = "w-full cursor-not-allowed rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60 outline-none"
const toggleClass = "flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-[#08090b]/60 px-4 py-3 text-sm text-white/75 transition hover:border-white/30 hover:bg-white/10"
