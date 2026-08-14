import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="login-page">
      <Link className="brand login-brand brand-logo" href="/" aria-label="Kay Poh home"><Image src="/brand/kaypoh-dark-outline.png" alt="Kay Poh" width={105} height={94} priority /></Link>
      <section className="login-panel">
        <Link className="back-link" href="/">← Back to the website</Link>
        <p className="eyebrow"><span /> Welcome back</p>
        <h1>Sign in to<br /><em>Kay Poh.</em></h1>
        <p className="login-intro">Access your trips as a member or manage operations as part of the Kay Poh team.</p>
        <div className="account-types"><button type="button" className="active">Traveller / Member</button><Link href="/admin">Admin / Guide →</Link></div>
        <form className="login-form" action="/admin">
          <label>Email address<input type="email" name="email" placeholder="you@example.com" autoComplete="email" /></label>
          <label>Password<input type="password" name="password" placeholder="Enter your password" autoComplete="current-password" /></label>
          <div className="login-options"><label><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div>
          <button className="match-button" type="submit">Sign in <span>→</span></button>
        </form>
        <p className="login-note">Account authentication will be connected when the member and admin systems are built.</p>
      </section>
      <aside className="login-art"><div className="login-sun" /><p>Good trips begin<br />with a little<br /><em>curiosity.</em></p><span>IPOH · PERAK · MALAYSIA</span></aside>
    </main>
  );
}
