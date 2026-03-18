import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Input } from "../../../components/form/input"
import { GoogleIcon } from "../../../components/svg"
import { EMAIL_REGEX } from "../../../utils/validations"
import styles from "./styles.module.scss"
import { Button } from "../../../components/form/buttons"

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        // TODO: connect to login API when backend is ready
        console.log("Login form data:", data)
    }

    const handleGoogleLogin = () => {
        // TODO: connect to Google OAuth when backend is ready
        console.log("Google login clicked")
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome Back</h1>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
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

                    <Button
                        label="Login"
                        type="submit"
                    />
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerLine}></span>
                    <span className={styles.dividerText}>or</span>
                    <span className={styles.dividerLine}></span>
                </div>

                <Button
                    label="Continue with Google"
                    type="button"
                    icon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                />

                <p className={styles.linkText}>
                    Don't have an account?{" "}
                    <Link to="/register" className={styles.link}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}