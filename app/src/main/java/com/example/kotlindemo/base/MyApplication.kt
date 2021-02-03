package com.example.kotlindemo.base

import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import com.example.kotlindemo.utils.SPUtils
import kotlin.properties.Delegates

class MyApplication : Application() {

    companion object {

        var instance: MyApplication by Delegates.notNull()

        fun instance() = instance
    }

    override fun attachBaseContext(base: Context?) {
        super.attachBaseContext(base)
       /* val sharedPreferences: SharedPreferences = getSharedPreferences("sss", Context.MODE_PRIVATE)
        sharedPreferences.edit()
            .putLong("application_attach_time", System.currentTimeMillis())
            .apply()*/

        SPUtils.getSPInstance(this).getSPEditor()
            .putLong("application_attach_time", System.currentTimeMillis())
            .apply()
    }

    override fun onCreate() {
        super.onCreate()
        instance = this

    }


}