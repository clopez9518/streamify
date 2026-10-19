import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth.store"
import { useProfileStore } from "@/store/profile.store"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface FormData {
    email: string
    password: string
}

export const LoginPage = () => {

    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()
    const [isPosting, setIsPosting] = useState(false)

    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: FormData) => {
        setIsPosting(true)

        const success = await login(data.email, data.password)
        if (success) {
            const activeProfile = useProfileStore.getState().activeProfile;
            const currentUser = useAuthStore.getState().user;

            if (!activeProfile || activeProfile.userId.toString() !== currentUser?.id) {
                navigate('/whos-watching');
            } else {
                navigate('/');
            }
            return;
        }

        setError('root', {
            message: 'Invalid credentials'
        })
        setIsPosting(false)
    }

    return (

        <Card className="w-full max-w-sm bg-[var(--background-card)]">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Link to="/auth/register">
                        <Button variant="link">Sign Up</Button>
                    </Link>
                </CardAction>
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
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" {...register('password', {
                                required: 'Password is required'
                            })} />
                            {errors.password &&
                                <p className="text-red-500">{errors.password.message}</p>
                            }

                            {errors.root && (

                                <p className="text-red-500 text-sm">
                                    {errors.root.message}
                                </p>

                            )}
                        </div>


                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 mt-5">
                    <Button disabled={isPosting} type="submit" className="w-full">
                        {isPosting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Login"
                        )}
                    </Button>


                    <Link className="ml-auto" to="/">
                        <div className="text-sm underline-offset-4 hover:underline">Continue as Guest</div>
                    </Link>
                </CardFooter>
            </form>
        </Card>
    )
}
