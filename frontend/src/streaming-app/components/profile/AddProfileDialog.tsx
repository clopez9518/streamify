import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddProfile } from "@/streaming-app/hooks/useUsers"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

interface FormData {
    name: string
    isKids: boolean
}

export const AddProfileDialog = () => {

    const addProfileMutation = useAddProfile()
    const [isPosting, setIsPosting] = useState(false);
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormData>({
        defaultValues: {
            name: "",
            isKids: false,
        }
    })

    const handleAddProfile = (data: FormData) => {
        setIsPosting(true);
        addProfileMutation.mutate(data, {
            onSuccess: () => {
                reset()
                setOpen(false);
            },
            onSettled: () => {
                setIsPosting(false);
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-primary">Add Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm dark">
                <form onSubmit={handleSubmit(handleAddProfile)}>
                    <DialogHeader className="mb-8">
                        <DialogTitle>Add Profile</DialogTitle>
                        <DialogDescription>
                            Add a new profile. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register("name", {
                                    required: "Name is required",
                                })} />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </Field>
                        <Field orientation="horizontal" className="w-20" >
                            <FieldLabel htmlFor="isKids-checkbox">
                                Is Kids
                            </FieldLabel>
                            <Controller
                                name="isKids"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="isKids-checkbox"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button disabled={isPosting} type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
