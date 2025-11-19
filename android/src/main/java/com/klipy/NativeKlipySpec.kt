package com.klipy

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

/**
 * Minimal stand-in for the TurboModule-generated base class.
 * When you wire up React Native codegen, this file can be removed
 * and replaced by the real NativeKlipySpec that codegen generates.
 */
abstract class NativeKlipySpec(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  abstract fun initialize(apiKey: String, options: ReadableMap?, promise: Promise)

  abstract fun open(promise: Promise)

  abstract fun addListener(eventName: String?)

  abstract fun removeListeners(count: Double)
}
