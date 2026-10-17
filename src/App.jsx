
import { useEffect, useState } from "react";
import "./App.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  education: "",
  experience: "",
  resumeUrl: "",
};

function validateForm(form) {
  const errors = {};

  if (form.fullName.trim().length < 3) {
    errors.fullName = "Name must contain at least 3 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!form.role) errors.role = "Please select a job role.";
  if (!form.education) errors.education = "Please select your education.";

  if (
    form.experience === "" ||
    !Number.isFinite(Number(form.experience)) ||
    Number(form.experience) < 0 ||
    Number(form.experience) > 50
  ) {
    errors.experience = "Enter experience between 0 and 50 years.";
  }

  if (form.resumeUrl.trim()) {
    try {
      const url = new URL(form.resumeUrl.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.resumeUrl = "Resume link must use HTTP or HTTPS.";
      }
    } catch {
      errors.resumeUrl = "Enter a valid resume URL.";
    }
  }

  return errors;
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [applications, setApplications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jobApplyApplications")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "jobApplyApplications",
      JSON.stringify(applications)
    );
  }, [applications]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setMessage("");

    if (Object.keys(validationErrors).length > 0) {
      setMessage("Please correct the highlighted fields.");
      return;
    }

    const newApplication = {
      ...form,
      id: Date.now(),
      submittedAt: new Date().toLocaleString(),
    };

    setApplications((previous) => [newApplication, ...previous]);
    setForm(initialForm);
    setErrors({});
    setMessage("Application submitted successfully!");
  }

  function deleteApplication(id) {
    setApplications((previous) =>
      previous.filter((application) => application.id !== id)
    );
  }

  function handleReset() {
    setForm(initialForm);
    setErrors({});
    setMessage("");
  }

  function fieldError(name) {
    return errors[name] ? (
      <small className="field-error">{errors[name]}</small>
    ) : null;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">J</span>
          JobApply
        </a>
        <span className="topbar-label">Your career starts here</span>
      </header>

      <main>
        <section className="hero" id="home">
          <span className="eyebrow">CAREER OPPORTUNITIES</span>
          <h1>Take the next step in your career.</h1>
          <p>
            Share your details and apply for a role that matches your
            skills, education and ambitions.
          </p>
          <div className="hero-stats">
            <div>
              <strong>{applications.length}</strong>
              <span>Applications submitted</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Career paths</span>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-card">
            <div className="section-heading">
              <span className="section-icon">✦</span>
              <div>
                <h2>Job application</h2>
                <p>Complete the form below to register your interest.</p>
              </div>
            </div>

            {message && (
              <div
                className={
                  message.startsWith("Application submitted")
                    ? "notice success"
                    : "notice warning"
                }
                role="status"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fullName">Full name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Pravin Thombare"
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {fieldError("fullName")}
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {fieldError("email")}
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Mobile number *</label>
                  <input
                    id="phone"
                    name="phone"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {fieldError("phone")}
                </div>

                <div className="form-field">
                  <label htmlFor="role">Job role *</label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.role)}
                  >
                    <option value="">Select a role</option>
                    <option>Software Developer</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Data Analyst</option>
                  </select>
                  {fieldError("role")}
                </div>

                <div className="form-field">
                  <label htmlFor="education">Education *</label>
                  <select
                    id="education"
                    name="education"
                    value={form.education}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.education)}
                  >
                    <option value="">Select education</option>
                    <option>Diploma</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>Other</option>
                  </select>
                  {fieldError("education")}
                </div>

                <div className="form-field">
                  <label htmlFor="experience">Experience (years) *</label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 0 for fresher"
                    aria-invalid={Boolean(errors.experience)}
                  />
                  {fieldError("experience")}
                </div>

                <div className="form-field full-width">
                  <label htmlFor="resumeUrl">Resume URL (optional)</label>
                  <input
                    id="resumeUrl"
                    name="resumeUrl"
                    type="url"
                    value={form.resumeUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/my-resume"
                    aria-invalid={Boolean(errors.resumeUrl)}
                  />
                  {fieldError("resumeUrl")}
                </div>
              </div>

              <p className="required-note">* Required fields</p>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Submit application →
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleReset}
                >
                  Clear form
                </button>
              </div>
            </form>
          </div>

          <aside className="info-card">
            <span className="info-symbol">↗</span>
            <h2>Ready for your next opportunity?</h2>
            <p>
              Make sure your contact details are correct before
              submitting your application.
            </p>
            <ul>
              <li>✓ Check your email address</li>
              <li>✓ Select the correct job role</li>
              <li>✓ Review your experience</li>
              <li>✓ Add your resume link if available</li>
            </ul>
            <div className="privacy-note">
              <strong>Demo application</strong>
              <span>
                Applications are saved in this browser for practical
                demonstration. No backend is connected.
              </span>
            </div>
          </aside>
        </section>

        <section className="applications-section">
          <div className="applications-heading">
            <div>
              <span className="eyebrow">YOUR ACTIVITY</span>
              <h2>Submitted applications</h2>
            </div>
            <span className="count-badge">{applications.length} total</span>
          </div>

          {applications.length === 0 ? (
            <div className="empty-state">
              <span>▤</span>
              <h3>No applications yet</h3>
              <p>Your successfully submitted applications will appear here.</p>
            </div>
          ) : (
            <div className="application-list">
              {applications.map((application) => (
                <article className="application-item" key={application.id}>
                  <div className="application-avatar">
                    {application.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="application-details">
                    <h3>{application.fullName}</h3>
                    <p>{application.role} · {application.education}</p>
                    <p>{application.email} · {application.phone}</p>
                    <small>
                      {application.experience} years experience ·{" "}
                      {application.submittedAt}
                    </small>
                    {application.resumeUrl && (
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View resume link
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteApplication(application.id)}
                    aria-label={`Delete application from ${application.fullName}`}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        JobApply · ReactJS Practical No. 3 · Built for learning
      </footer>
    </div>
  );
}

export default App;
