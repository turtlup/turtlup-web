import React from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { IMUData } from '../services/BluetoothService';

interface BodyModelProps {
  imuData: IMUData[];
  width: number;
  height: number;
}

const BodyModel: React.FC<BodyModelProps> = ({ imuData, width, height }) => {
  // Define the torso shape points
  const torsoPoints = [
    width * 0.4, height * 0.2,  // Left shoulder
    width * 0.6, height * 0.2,  // Right shoulder
    width * 0.65, height * 0.6, // Right hip
    width * 0.35, height * 0.6, // Left hip
  ];

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
        {imuData.map((imu, index) => (
          <Circle
            key={imu.id}
            x={imu.position.x * width}
            y={imu.position.y * height}
            radius={10}
            fill={imu.isOutOfPosition ? '#ff4444' : '#44ff44'}
            stroke="#333"
            strokeWidth={2}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default BodyModel;