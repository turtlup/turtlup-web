import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IMUDataWithId } from '../services/BluetoothService';

interface PostureContextType {
    referencePosture: IMUDataWithId | null;
    setReferencePosture: (data: IMUDataWithId) => void;
    isGoodPosture: (currentData: IMUDataWithId) => boolean;
}

const PostureContext = createContext<PostureContextType | undefined>(undefined);

export const PostureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [referencePosture, setReferencePostureState] = useState<IMUDataWithId | null>(null);

    const setReferencePosture = (data: IMUDataWithId) => {
        console.log('Setting reference posture:', data);
        setReferencePostureState(data);
    };

    // Function to determine if current posture matches the reference posture
    const isGoodPosture = (currentData: IMUDataWithId): boolean => {
        if (!referencePosture) return true; // No reference yet

        // Compare current IMU data with the reference
        const threshold = 10; // Adjust this based on your sensitivity needs

        // Check each IMU sensor data point
        for (let i = 0; i < Math.min(currentData.data.length, referencePosture.data.length); i++) {
            const current = currentData.data[i];
            const reference = referencePosture.data[i];

            // Calculate deviation from reference
            const xDiff = Math.abs(current.ax - reference.ax);
            const yDiff = Math.abs(current.ay - reference.ay);
            const zDiff = Math.abs(current.az - reference.az);

            // If any axis exceeds threshold, posture is bad
            if (xDiff > threshold || yDiff > threshold || zDiff > threshold) {
                return false;
            }
        }

        return true;
    };

    return (
        <PostureContext.Provider
            value={{
                referencePosture,
                setReferencePosture,
                isGoodPosture
            }}
        >
            {children}
        </PostureContext.Provider>
    );
};

// Custom hook to use the posture context
export const usePosture = () => {
    const context = useContext(PostureContext);
    if (context === undefined) {
        throw new Error('usePosture must be used within a PostureProvider');
    }
    return context;
};