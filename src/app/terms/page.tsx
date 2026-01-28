import styles from '../privacy-policy/Legal.module.css';

export default function TermsOfService() {
    return (
        <div className={styles.legalPage}>
            <div className="container">
                <h1>Terms of Service</h1>
                <p>Last updated: January 2024</p>

                <section>
                    <h2>1. Agreement to Terms</h2>
                    <p>By accessing our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                </section>

                <section>
                    <h2>2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials on Faroo's website for personal, non-commercial transitory viewing only.</p>
                </section>

                <section>
                    <h2>3. Disclaimer</h2>
                    <p>The materials on Faroo's website are provided on an 'as is' basis. Faroo makes no warranties, expressed or implied.</p>
                </section>
            </div>
        </div>
    );
}
