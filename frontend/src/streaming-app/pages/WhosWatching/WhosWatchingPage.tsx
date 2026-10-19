import { useState } from "react"
import { ArrowLeft, Plus, ShieldCheck, UserPlus, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { useNavigate } from "react-router"
import { useAuthStore } from "@/store/auth.store"
import { useProfileStore } from "@/store/profile.store"
import { addProfileAction } from "@/streaming-app/actions/user/user.action"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { notify } from "@/lib/notify"

const profileAccents = [
    "from-white/20 via-white/10 to-white/5",
    "from-cyan-300/25 via-white/10 to-white/5",
    "from-emerald-300/25 via-white/10 to-white/5",
    "from-rose-300/25 via-white/10 to-white/5",
    "from-amber-300/25 via-white/10 to-white/5",
]

export const WhosWatchingPage = () => {
    const navigate = useNavigate()
    const { user, selectProfile } = useAuthStore()
    const setActiveProfile = useProfileStore((state) => state.setActiveProfile)

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newProfileName, setNewProfileName] = useState("")
    const [isKidsProfile, setIsKidsProfile] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const profiles = user?.profiles || []
    const canAddProfile = profiles.length < 5

    const handleProfileSelect = async (profileId: number) => {
        const selectedProfile = user?.profiles.find(p => p.id === profileId)

        if (selectedProfile) {
            await selectProfile(selectedProfile.id)
            setActiveProfile(selectedProfile)
        }

        navigate("/")
    }

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newProfileName.trim()) {
            notify.error("Por favor ingresa un nombre para el perfil")
            return
        }

        try {
            setIsSubmitting(true)
            const created = await addProfileAction({
                name: newProfileName.trim(),
                isKids: isKidsProfile,
            })

            // Update user profiles in auth store
            if (user) {
                user.profiles = [...user.profiles, created]
            }

            notify.success(`Perfil "${created.name}" creado correctamente`)
            setIsCreateDialogOpen(false)
            setNewProfileName("")
            setIsKidsProfile(false)

            // Activate newly created profile and navigate
            await selectProfile(created.id)
            setActiveProfile(created)
            navigate("/")
        } catch (error) {
            notify.error(error instanceof Error ? error.message : "Error al crear perfil")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="dark relative flex min-h-screen flex-col overflow-hidden bg-[#08090b] px-6 text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-black/55 to-transparent" />

            <header className="relative z-10 flex items-center justify-between py-8">
                <button
                    onClick={() => navigate("/")}
                    className="text-xl font-semibold tracking-normal text-white transition-opacity hover:opacity-80"
                >
                    STREAMIFY
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 text-sm font-medium text-white/80 shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:border-white/30 hover:bg-white/15 hover:text-white cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            </header>

            <main className="relative z-10 flex flex-1 items-center justify-center py-12">
                <section className="w-full max-w-6xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                            Select profile
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-6xl">
                            Who is watching?
                        </h1>
                    </div>

                    {profiles.length === 0 ? (
                        <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
                                <UserPlus className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">No tienes perfiles creados</h2>
                            <p className="mt-2 text-sm text-white/60">
                                Para comenzar a ver tus películas y series favoritas, crea tu primer perfil de visualización.
                            </p>
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="mt-6 w-full bg-white font-semibold text-black hover:bg-white/90"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Crear mi primer perfil
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {profiles.map((profile, index) => (
                                <motion.button
                                    key={profile.id}
                                    onClick={() => handleProfileSelect(profile.id)}
                                    className="group rounded-md border border-white/10 bg-white/5 p-4 text-left shadow-[0_18px_42px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={`relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-md border border-white/10 bg-linear-to-br ${profileAccents[index % profileAccents.length]}`}>
                                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                                        <span className="relative text-5xl font-semibold text-white md:text-6xl">
                                            {profile.name.charAt(0).toUpperCase()}
                                        </span>

                                        {profile.isKids && (
                                            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md border border-white/15 bg-[#08090b]/70 px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                                                <ShieldCheck className="h-3 w-3" />
                                                Kids
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="truncate text-base font-medium text-white/80 transition-colors group-hover:text-white">
                                            {profile.name}
                                        </span>
                                        <span className="h-2 w-2 rounded-full bg-white/30 transition-colors group-hover:bg-white" />
                                    </div>
                                </motion.button>
                            ))}

                            {/* Add Profile Card */}
                            {canAddProfile && (
                                <motion.button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="group flex flex-col justify-between rounded-md border border-dashed border-white/20 bg-white/[0.02] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.06] focus:outline-none cursor-pointer"
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative mb-4 flex aspect-square items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 transition group-hover:border-white/40 group-hover:bg-white/10">
                                        <Plus className="h-10 w-10 text-white/50 transition group-hover:text-white group-hover:scale-110" />
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-base font-medium text-white/60 transition-colors group-hover:text-white">
                                            Add Profile
                                        </span>
                                    </div>
                                </motion.button>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Create Profile Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md dark bg-[#0f1117] border-white/15 text-white">
                    <form onSubmit={handleCreateProfile}>
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-semibold text-white">Crear nuevo perfil</DialogTitle>
                            <DialogDescription className="text-white/60">
                                Agrega un perfil independiente para personalizar listas y recomendaciones.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="profile-name" className="text-sm font-medium text-white/80">
                                    Nombre del perfil
                                </Label>
                                <Input
                                    id="profile-name"
                                    placeholder="Ej. Juan, Familia, Niños..."
                                    value={newProfileName}
                                    onChange={(e) => setNewProfileName(e.target.value)}
                                    maxLength={30}
                                    required
                                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                                />
                            </div>

                            <div className="flex items-center space-x-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                                <Checkbox
                                    id="kids-mode"
                                    checked={isKidsProfile}
                                    onCheckedChange={(checked) => setIsKidsProfile(Boolean(checked))}
                                />
                                <div className="space-y-1 leading-none">
                                    <Label htmlFor="kids-mode" className="text-sm font-medium text-white cursor-pointer">
                                        ¿Es un perfil para niños?
                                    </Label>
                                    <p className="text-xs text-white/50">
                                        Filtra automáticamente contenidos clasificados para adultos y violencia.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-8 gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !newProfileName.trim()}
                                className="bg-white text-black hover:bg-white/90 font-medium"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Perfil
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
