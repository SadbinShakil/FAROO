import styles from './Legal.module.css';

export default function PrivacyPolicy() {
    return (
        <div className={styles.legalPage}>
            <div className="container">
                <h1>Privacy Policy</h1>
                <p>Last updated: January 2024</p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when you create an account, place an order, or contact us. This may include your name, email address, phone number, and shipping address.</p>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to process your orders, communicate with you about your account, and improve our services.</p>
                </section>

                <section>
                    <h2>3. Data Security</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
                </section>
            </div>
        </div>
    );
}
