import React from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { IMUData } from '../services/BluetoothService';
import { usePosture } from '../context/PostureContext';

interface BodyModelProps {
  currentImuData?: IMUData;
  referencePosture?: IMUData;
  width: number;
  height: number;
}

const BodyModel: React.FC<BodyModelProps> = ({ width, height }) => {
  const {
    currentImuData,
    referencePosture,
    isConnected,
    connectDevice,
    setReferencePosture
  } = usePosture();

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
        {currentImuData?.data.map((imuData: IMUData, index: number) => {
          // Get the position based on the predefined points
          const positionIndex = index % 4;
          const x = torsoPoints[positionIndex * 2];
          const y = torsoPoints[positionIndex * 2 + 1];

          // compare 

          return (
            <Circle
              key={`${1}-${index}`}
              x={x}
              y={y}
              radius={10}
              fill={"#333"}
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