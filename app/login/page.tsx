import styles from './login.module.css'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string }
}) {
  const from = searchParams.from ?? '/'
  const hasError = searchParams.error === '1'

  return (
    <main className={styles.wrap}>
      <div className={styles.ambient} aria-hidden="true" />

      <div className={styles.card}>
        <p className={styles.eyebrow}>Est. 1854 · A Living Record</p>
        <h1 className={styles.title}>
          The <span style={{ color: 'var(--gold)' }}>Benford</span>
          {' · '}
          <span style={{ color: '#9a8acf' }}>Penny</span>
          {' · '}
          <span style={{ color: '#7abf82' }}>Johnson</span>
          <br />
          Family Tree
        </h1>
        <p className={styles.subtitle}>
          This site is private to the family. Please enter the access password to continue.
        </p>

        <form className={styles.form} method="POST" action="/api/login">
          <input type="hidden" name="from" value={from} />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            autoFocus
            autoComplete="current-password"
            required
          />
          <button type="submit" className="btn btn-gold">
            Enter
          </button>
        </form>

        {hasError && <p className={styles.error}>Incorrect password. Please try again.</p>}
      </div>
    </main>
  )
}
