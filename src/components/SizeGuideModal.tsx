'use client';

import { X } from 'lucide-react';
import styles from './SizeGuideModal.module.css';
import { useEffect, useState } from 'react';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string;
}

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
            <div className={`${styles.modal} ${isOpen ? styles.open : ''}`} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className={styles.title}>Size Guide</h2>
                <p className={styles.subtitle}>Find your perfect fit for {category}</p>

                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.active}`}>CM</button>
                    <button className={styles.tab}>INCHES</button>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Size</th>
                                <th>Chest</th>
                                <th>Length</th>
                                <th>Sleeve</th>
                                <th>Shoulder</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.sizeLabel}>M</td>
                                <td>38-40</td>
                                <td>27</td>
                                <td>8</td>
                                <td>17</td>
                            </tr>
                            <tr>
                                <td className={styles.sizeLabel}>L</td>
                                <td>40-42</td>
                                <td>28</td>
                                <td>8.5</td>
                                <td>18</td>
                            </tr>
                            <tr>
                                <td className={styles.sizeLabel}>XL</td>
                                <td>42-44</td>
                                <td>29</td>
                                <td>9</td>
                                <td>19</td>
                            </tr>
                            <tr>
                                <td className={styles.sizeLabel}>XXL</td>
                                <td>44-46</td>
                                <td>30</td>
                                <td>9.5</td>
                                <td>20</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.instructions}>
                    <h3>How to Measure</h3>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <span className={styles.stepNum}>1</span>
                            <div>
                                <strong>Chest</strong>
                                <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNum}>2</span>
                            <div>
                                <strong>Length</strong>
                                <p>Measure from the highest point of the shoulder down to the hem.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
