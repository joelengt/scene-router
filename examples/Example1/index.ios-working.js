/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

const React = require('react-native');
const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  Animated,
  Dimensions
} = React;

const { scenify, Scenes } = require('./libs');

class FirstSceneLoading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Text>First Scene Loading</Text>
    );
  }
}

class FirstScene extends Component {
  constructor(props) {
    super(props);
  }

  sceneWillFocus() {
    console.log('FirstScene sceneWillFocus');
  }

  sceneDidFocus() {
    console.log('FirstScene sceneDidFocus');
  }

  sceneWillBlur() {
    console.log('FirstScene sceneWillBlur');
  }

  sceneDidBlur() {
    console.log('FirstScene sceneDidBlur');
  }

  componentDidMount() {
    console.log('FirstScene componentDidMount');
  }

  componentWillUnmount() {
    console.log('FirstScene componentWillUnmount');
  }

  render() {
    return (
      <View ref="root" style={{ backgroundColor: 'red', flex: 1 }}></View>
    );
  }
}

class SecondScene extends Component {
  constructor(props) {
    super(props);
  }

  sceneWillFocus() {
    console.log('SecondScene sceneWillFocus');
  }

  sceneDidFocus() {
    console.log('SecondScene sceneDidFocus');
  }

  sceneWillBlur() {
    console.log('SecondScene sceneWillBlur');
  }

  sceneDidBlur() {
    console.log('SecondScene sceneDidBlur');
  }

  componentDidMount() {
    console.log('SecondScene componentDidMount');
  }

  componentWillUnmount() {
    console.log('SecondScene componentWillUnmount');
  }

  render() {
    return (
      <View ref="root" style={{ backgroundColor: 'yellow', flex: 1 }}></View>
    );
  }
}

class Example1 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { scenes } = this.refs;
    setTimeout(() => {
      scenes.push('left', true, scenify(FirstSceneLoading)(SecondScene));
    }, 1000);

    setTimeout(() => {
      scenes.pop();
    }, 3000);
  }

  render() {
    return (
      <Scenes ref="scenes" initalScene={{ component: scenify()(FirstScene) }}/>
    );
  }
}

AppRegistry.registerComponent('Example1', () => Example1);
