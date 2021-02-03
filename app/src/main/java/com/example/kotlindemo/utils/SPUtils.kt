package com.example.kotlindemo.utils

import android.content.Context
import android.content.SharedPreferences

class SPUtils(context: Context) {
    companion object {

        // 创建一个写入器
        private lateinit var mPreferences: SharedPreferences
        private lateinit var mEditor: SharedPreferences.Editor
        private var mSharedPreferencesUtil: SPUtils? = null

        // 单例模式
        fun getSPInstance(context: Context): SPUtils {
            if (mSharedPreferencesUtil == null) {
                mSharedPreferencesUtil = SPUtils(context)
            }
            return mSharedPreferencesUtil!!
        }
    }

    init {
        mPreferences = context.getSharedPreferences("sss", Context.MODE_PRIVATE)
        mEditor = mPreferences.edit()
    }

    // 移除数据
    fun removeSP(key: String) {
        mEditor.remove(key)
        mEditor.apply()
    }

    // 移除数据
    fun removeAllSP(key: String) {
        mEditor.clear()
        mEditor.apply()
    }

    fun getSP() = mPreferences
    fun getSPEditor() = mEditor
}
