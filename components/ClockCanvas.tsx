import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  PanResponder,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { colors, radius, shadow } from '../lib/theme';

export type ClockCanvasHandle = {
  clear: () => void;
  undo: () => void;
  strokeCount: () => number;
  /** Capture the canvas as a PNG and return a local file URI. */
  capture: () => Promise<string>;
};

type Props = {
  size: number;
};

/**
 * Square finger-drawing canvas built on react-native-svg + PanResponder.
 * Strokes are stored as SVG path "d" strings and rendered live as the user draws.
 * Exposes imperative handle for clear/undo/capture so parent screens can drive it.
 */
export const ClockCanvas = forwardRef<ClockCanvasHandle, Props>(function ClockCanvas(
  { size },
  ref
) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');

  // Use refs alongside state so PanResponder closures always see fresh values.
  const pathsRef = useRef<string[]>([]);
  const currentRef = useRef<string>('');

  // Wrapping View ref for view-shot capture.
  const containerRef = useRef<View>(null);

  function setPathsBoth(next: string[]) {
    pathsRef.current = next;
    setPaths(next);
  }
  function setCurrentBoth(next: string) {
    currentRef.current = next;
    setCurrentPath(next);
  }

  function fmt(n: number) {
    return n.toFixed(1);
  }

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        setCurrentBoth(`M${fmt(locationX)},${fmt(locationY)}`);
      },
      onPanResponderMove: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;
        setCurrentBoth(`${currentRef.current} L${fmt(locationX)},${fmt(locationY)}`);
      },
      onPanResponderRelease: () => {
        if (currentRef.current) {
          setPathsBoth([...pathsRef.current, currentRef.current]);
          setCurrentBoth('');
        }
      },
      onPanResponderTerminate: () => {
        if (currentRef.current) {
          setPathsBoth([...pathsRef.current, currentRef.current]);
          setCurrentBoth('');
        }
      },
    })
  ).current;

  useImperativeHandle(
    ref,
    (): ClockCanvasHandle => ({
      clear: () => {
        setPathsBoth([]);
        setCurrentBoth('');
      },
      undo: () => {
        setPathsBoth(pathsRef.current.slice(0, -1));
      },
      strokeCount: () => pathsRef.current.length,
      capture: async () => {
        if (!containerRef.current) {
          throw new Error('Canvas not mounted');
        }
        return captureRef(containerRef.current, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });
      },
    }),
    []
  );

  return (
    <View
      ref={containerRef}
      collapsable={false}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.surfaceContainerLowest,
        borderRadius: radius.xl,
        overflow: 'hidden',
        ...shadow.card,
      }}
      {...responder.panHandlers}
    >
      <Svg width={size} height={size}>
        {paths.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={colors.primary}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {currentPath ? (
          <Path
            d={currentPath}
            stroke={colors.primary}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>
    </View>
  );
});
