import React, { Component } from 'react';
import 'react-native-gesture-handler';
import MainApp from './src/Navigator';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.'])

export default function App() {
  return (
    <MainApp />
  );
}