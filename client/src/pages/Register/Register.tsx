import { useState, type SubmitEvent } from "react";
import { NavLink, useNavigate } from "react-router";
import "../../assets/css/form.css";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { getNavLinkClass } from "../../utils/getNavLinkClass";
import { registerUser } from "../../utils/api";

export default function Register() {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { values, handleChange, errors, isValid } =
        useFormWithValidation({ name: "", email: "", password: "" });

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isValid) return;
        setSubmitError(null);
        try {
            await registerUser(values.name, values.email, values.password);
            navigate("/login")
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "Registration failed.",
            );
        }
    }

    return (
        <main className="auth-page register">
            <header className="auth-page__header">
                <h1 className="auth-page__title">Register</h1>
                <p className="auth-page__subtitle">
                    Access your organisation's secure workspace
                </p>
            </header>

            <nav className="auth-tabs" aria-label="Account">
                <NavLink className={getNavLinkClass} to="/login">Login</NavLink>
                <NavLink className={getNavLinkClass} to="/register">Create account</NavLink>
            </nav>

            <form className="auth-form register__form" onSubmit={handleSubmit} noValidate>
                {submitError && (
                    <p className="auth-form__error auth-form__error_general" role="alert">
                        {submitError}
                    </p>
                )}
                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="name">Name</label>
                    <input
                        className="auth-form__input"
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={40}
                        value={values.name}
                        aria-invalid={Boolean(errors.name)}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="auth-form__error" role="alert">{errors.name}</p>}
                </div>

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
                        aria-invalid={Boolean(errors.email)}
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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={values.password}
                    aria-invalid={Boolean(errors.password)}
                    onChange={handleChange}
                />
                    {errors.password && <p className="auth-form__error" role="alert">{errors.password}</p>}
                </div>

                <button className="auth-form__submit" type="submit" disabled={!isValid}>
                    Register
                </button>
            </form>
        </main>
    );
}