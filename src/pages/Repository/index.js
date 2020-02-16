import React from 'react';
import { WebView } from 'react-native-webview';

export default function Repository(props) {
  const { route } = props;

  return (
    <WebView source={{ uri: route.params?.html_url }} style={{ flex: 1 }} />
  );
}
