import { useForm } from "react-hook-form"
import styles from "./styles.module.scss"
import { Input } from "../../../components/form/input"
import { Button } from "../../../components/form/buttons"
import { EMAIL_REGEX, NAME_REGEX } from "../../../utils/validations"
import { GoogleIcon } from "../../../components/svg"
import { Link } from "react-router-dom"

export const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm()

    const onSubmit = (data) => {
        // TODO: connect to login API when backend is ready
        console.log("Register data:", data)
    }

    const handleGoogleLogin = () => {
        // TODO: connect to Google OAuth when backend is ready
        console.log("Google login clicked")
    }
    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create an Account</h1>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        name="name"
                        label="Name"
                        placeholder="Enter your name"
                        register={register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters",
                            },
                            pattern: {
                                value: NAME_REGEX,
                                message: "Name must be at least 2 characters and contain only letters and spaces",
                            },
                        })}
                        error={errors.name?.message}
                    />

                    <Input
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        register={register("email", {
                            required: "Email is required",
                            pattern: {
                                value: EMAIL_REGEX,
                                message: "Enter a valid email address",
                            },
                        })}
                        error={errors.email?.message}
                    />

                    <Input
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        register={register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        error={errors.password?.message}
                    />

                    <Input
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        register={register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === watch("password") || "Passwords do not match",
                        })}
                        error={errors.confirmPassword?.message}
                    />

                    <Button
                        label="Register"
                        type="submit"
                    />

                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerLine}></span>
                    <span className={styles.dividerText}>or</span>
                    <span className={styles.dividerLine}></span>
                </div>

                <Button
                    label="Sign up with Google"
                    type="button"
                    icon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                />

                <p className={styles.linkText}>
                    Already have an account?{" "}
                    <Link to="/login" className={styles.link}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}