import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { IMUDataWithId, bluetoothService } from '../services/BluetoothService';

interface PostureContextType {
    // Reference posture management
    referencePosture: IMUDataWithId | null;
    setReferencePosture: (data: IMUDataWithId) => void;
    isGoodPosture: (currentData: IMUDataWithId) => boolean;

    // IMU data distribution
    currentImuData: IMUDataWithId | null;
    imuDataHistory: IMUDataWithId[];
    isConnected: boolean;
    connectDevice: () => Promise<void>;
    disconnectDevice: () => void;
}

const PostureContext = createContext<PostureContextType | undefined>(undefined);

export const PostureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Reference posture state
    const [referencePosture, setReferencePostureState] = useState<IMUDataWithId | null>(null);

    // IMU data state
    const [currentImuData, setCurrentImuData] = useState<IMUDataWithId | null>(null);
    const [imuDataHistory, setImuDataHistory] = useState<IMUDataWithId[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    // Set up Bluetooth event listeners
    useEffect(() => {
        bluetoothService.on('connected', () => {
            console.log("Bluetooth connected event in PostureContext");
            setIsConnected(true);
        });

        bluetoothService.on('disconnected', () => {
            console.log("Bluetooth disconnected event in PostureContext");
            setIsConnected(false);
        });

        bluetoothService.on('imuData', (data: IMUDataWithId) => {
            // Update current IMU data
            setCurrentImuData(data);

            // Update history with limited capacity
            setImuDataHistory(prev => {
                const newHistory = [...prev, data];
                // Keep only the last 100 entries for performance
                if (newHistory.length > 100) {
                    return newHistory.slice(-100);
                }
                return newHistory;
            });
        });

        return () => {
            bluetoothService.removeAllListeners();
        };
    }, []);

    // Connect device method
    const connectDevice = async () => {
        try {
            await bluetoothService.connect();
            return Promise.resolve();
        } catch (error) {
            console.error("Failed to connect device:", error);
            return Promise.reject(error);
        }
    };

    // Disconnect device method
    const disconnectDevice = () => {
        bluetoothService.disconnect();
    };

    // Set reference posture method
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
                // Reference posture
                referencePosture,
                setReferencePosture,
                isGoodPosture,

                // IMU data 
                currentImuData,
                imuDataHistory,
                isConnected,
                connectDevice,
                disconnectDevice
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