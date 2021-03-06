// @flow

import React from 'react'
import route from 'trie-route'

import * as constants from './constants'
import { Scene } from './scene'

import type { SceneConfig, Route, Router, SceneResolver, SceneRejecter, RouterExtra, GestureStatus } from './types'

// types //////////////////////////////////////////////////////////////////////

type SceneWrapProps = {
  sceneRef: (ref: any) => void,
  customSceneConfig: SceneConfig,
  route: Route,
  onGesture: (status: GestureStatus) => void
}

// internal functions /////////////////////////////////////////////////////////

const mergeDefaultSceneOptions = (options: SceneConfig): SceneConfig => {
  return {
    side: constants.FromRight,
    threshold: 30,
    gesture: true,
    reset: false,
    backgroundColor: 'white',
    ...options
  }
}

// what we have to do is,
const mergeCustomSceneOptions = (currentOpts: SceneConfig, userOpts: SceneConfig): SceneConfig => {
  // currentOpts is the one which was configured at scene decorator.
  // userOpts is the one which was passed by router to chnage the behaviour
  // so, we need to make sure to remove userOpts.path and merge it with currentOpts
  delete userOpts.path

  return {
    ...currentOpts,
    ...userOpts
  }
}

// SceneManager ///////////////////////////////////////////////////////////////

export class SceneManager {
  router: Router
  resolver: ?SceneResolver
  rejecter: ?SceneRejecter

  constructor() {
    this.router = route.create()
  }

  register(SceneWrap: Function, originalSceneConfig: SceneConfig) {
    this.router.path(originalSceneConfig.path, (params: Object = {}, qs: Object = {}, extra: RouterExtra) => {
      const { path, props, customSceneConfig } = extra
      const route = {
        path,
        params,
        qs,
        props,
        config: null
      }
      this.resolver && this.resolver(SceneWrap, route, originalSceneConfig, customSceneConfig)
    })
  }

  request(path: string, props: ?Object = {}, customSceneConfig: SceneConfig) {
    const err = this.router.process(path, { path, props, customSceneConfig })
    if (err) {
      this.rejecter && this.rejecter(`'${path}' ${err}`)
    }
  }

  // this callback will be set by Router class
  setSceneResolver(sceneResolver: SceneResolver) {
    this.resolver = sceneResolver
  }

  setSceneRejecter(sceneRejecter: SceneRejecter) {
    this.rejecter = sceneRejecter
  }
}

export const sceneManager = new SceneManager()

// dcecorators /////////////////////////////////////////////////////////////////

export const scene = (originalSceneConfig: SceneConfig): Function => {
  originalSceneConfig = mergeDefaultSceneOptions(originalSceneConfig)

  return (WrapComponent: Function): Function => {
    const SceneWrap = (props: SceneWrapProps): React.Element<any> => {
      const { customSceneConfig, route, onGesture } = props
      const sceneConfig = mergeCustomSceneOptions(originalSceneConfig, customSceneConfig)

      return (
        <Scene
          ref={props.sceneRef}
          WrapComponent={WrapComponent}
          sceneConfig={sceneConfig}
          route={route}
          onGesture={onGesture}/>
      )
    }

    sceneManager.register(SceneWrap, originalSceneConfig)

    return WrapComponent
  }
}