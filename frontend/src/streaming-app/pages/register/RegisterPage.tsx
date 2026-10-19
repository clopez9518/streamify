import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { Loader2 } from "lucide-react"


interface FormData {
    email: string
    password: string
    passwordConfirmation: string
}

export const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
            passwordConfirmation: ''
        }
    })

    const navigate = useNavigate()

    const [isPosting, setIsPosting] = useState(false)
    const { register: registerStore } = useAuthStore()

    const onSubmit = async (formData: FormData) => {
        setIsPosting(true)
        const { email, password, passwordConfirmation } = formData
        const success = await registerStore(email, password, passwordConfirmation)

        if (success) {
            setIsPosting(false)
            navigate('/')
            return
        }

        // TODO: Add error toast
        setIsPosting(false)
    }


    return (
        <Card className="w-full max-w-sm bg-[var(--background-card)]">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create an account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register('password', {
                                required: 'Password is required'
                            })} />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                            <Input id="passwordConfirmation" type="password" {...register('passwordConfirmation', {
                                required: 'Password confirmation is required'
                            })} />
                            {errors.passwordConfirmation && <p className="text-red-500">{errors.passwordConfirmation.message}</p>}
                        </div>

                        <div className="flex items-center">

                            <Link
                                to="/auth/login"
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                                Already have an account?
                            </Link>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 mt-5">
                    <Button disabled={isPosting} type="submit" className="w-full">
                        {isPosting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Register"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
