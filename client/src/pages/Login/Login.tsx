import { useState, type SubmitEvent } from "react";
import { NavLink, useLocation } from "react-router";
import "../../assets/css/form.css";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { getNavLinkClass } from "../../utils/getNavLinkClass";
import { loginUser } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const returnTo =
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
        "/knowledge";
    const { values, handleChange, errors, isValid } =
        useFormWithValidation({ email: "", password: "" });

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isValid) return;

        setSubmitError(null);
        try {
            const res = await loginUser(values.email, values.password);
            if (res.data) {
                login(res.data.token, res.data.user);
                navigate(returnTo, { replace: true });
            } else {
                setSubmitError(res.error?.message ?? "Login failed.");
            }
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "Login failed.",
            );
        }
    }

    return (
        <main className="auth-page login">
            <header className="auth-page__header">
                <h1 className="auth-page__title">Sign in</h1>
                <p className="auth-page__subtitle">
                    Access your organisation's secure workspace
                </p>
            </header>

            <nav className="auth-tabs" aria-label="Account">
                <NavLink className={getNavLinkClass} to="/login">Login</NavLink>
                <NavLink className={getNavLinkClass} to="/register">Register</NavLink>
            </nav>

            <form className="auth-form login__form" onSubmit={handleSubmit} noValidate>
                {submitError && <p className="auth-form__error" role="alert">{submitError}</p>}
                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="email">Email</label>
                <input
                    className="auth-form__input"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={handleChange}
                />
                    {errors.email && <p className="auth-form__error" role="alert">{errors.email}</p>}
                </div>

                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="password">Password</label>
                <input
                    className="auth-form__input"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={values.password}
                    onChange={handleChange}
                />
                    {errors.password && <p className="auth-form__error" role="alert">{errors.password}</p>}
                </div>

                <button className="auth-form__submit" type="submit" disabled={!isValid}>
                    Log in
                </button>
            </form>
        </main>
    );
}