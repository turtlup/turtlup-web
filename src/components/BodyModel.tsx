import React from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { IMUData } from '../services/BluetoothService';
import { IMUDataWithId } from "../services/BluetoothService";

interface BodyModelProps {
  imuData: IMUDataWithId;
  width: number;
  height: number;
  goodPosture?: boolean; // Optional prop for posture status
}

const BodyModel: React.FC<BodyModelProps> = ({ imuData, width, height, goodPosture }) => {
  // Define the torso shape points
  const torsoPoints = [
    width * 0.4, height * 0.2,  // Left shoulder
    width * 0.6, height * 0.2,  // Right shoulder
    width * 0.65, height * 0.6, // Right hip
    width * 0.35, height * 0.6, // Left hip
  ];

  // Function to determine circle color based on IMU data and posture status
  const getCircleColor = (imu: IMUData) => {
    // If goodPosture prop is provided, use it to determine color
    if (goodPosture !== undefined) {
      return goodPosture ? '#44ff44' : '#ff4444'; // Green for good posture, red for bad
    }

    // Otherwise use the original logic based on IMU data
    const xLevel = Math.abs(imu.ax);
    const yLevel = Math.abs(imu.ay);
    const zLevel = Math.abs(imu.az);

    // Threshold for movement detection
    const threshold = 5;

    if (xLevel > threshold) {
      // Calculate intensity based on highest movement value
      const maxLevel = Math.max(xLevel, yLevel, zLevel);
      const intensity = Math.min(255, Math.round((maxLevel / 20) * 255));

      // Red gets more intense with higher values
      const red = Math.min(255, 100 + intensity);
      const green = Math.max(0, 255 - intensity);
      const blue = 50;

      return `rgb(${red},${green},${blue})`;
    }

    // Default color when stable (green)
    return '#44ff44';
  };

  // Handle the case where imuData is undefined or doesn't have a data property
  if (!imuData || !imuData.data || imuData.data.length === 0) {
    return (
      <Stage width={width} height={height}>
        <Layer>
          <Line
            points={torsoPoints}
            closed
            stroke="#333"
            strokeWidth={2}
          />
          <Circle
            x={width / 2}
            y={height / 2}
            radius={10}
            fill="#999999"
            stroke="#333"
            strokeWidth={2}
          />
        </Layer>
      </Stage>
    );
  }

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Draw torso outline */}
        <Line
          points={torsoPoints}
          closed
          stroke="#333"
          strokeWidth={2}
        />

        {/* Draw IMU points */}
        {imuData.data.map((imu: any, index: number) => {
          // Get the position based on the predefined points
          const positionIndex = index % 4;
          const x = torsoPoints[positionIndex * 2];
          const y = torsoPoints[positionIndex * 2 + 1];

          return (
            <Circle
              key={`${imuData.id}-${index}`}
              x={x}
              y={y}
              radius={10}
              fill={getCircleColor(imu)}
              stroke="#333"
              strokeWidth={2}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default BodyModel;