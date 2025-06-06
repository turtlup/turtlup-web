import React from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
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
    isGoodPosture
  } = usePosture();

  const goodPosture = isGoodPosture(currentImuData)

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Circle
          key={`indicator-${currentImuData?.id}`}
          x={width / 2}
          y={height / 2}
          radius={50}
          fill={goodPosture ? 'green' : 'red'}
          stroke="#333"
          strokeWidth={2}
        />
        <Text
          x={width / 2}
          y={height / 2 + 70} // Position it below the circle
          text={goodPosture ? "In Alignment 😊" : "Out of Alignment 😔"}
          fontSize={18}
          fontFamily="Montserrat"
          fontStyle="bold"
          fill={goodPosture ? "green" : "red"}
          align="center"
          width={width}
          offsetX={width / 2} // Center the text horizontally
        />
        <Text
          x={width / 2}
          y={height / 2 + 100} // Position it below the circle
          text={goodPosture ? "Good Job!" : "Sit tall - feel strong!"}
          fontSize={12}
          fontFamily="Montserrat"
          fontStyle="bold"
          fill={goodPosture ? "green" : "red"}
          align="center"
          width={width}
          offsetX={width / 2} // Center the text horizontally
        />


      </Layer>
    </Stage>
  );
};

/// in alignment vs 
export default BodyModel;