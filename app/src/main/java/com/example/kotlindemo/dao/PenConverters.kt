package com.example.kotlindemo.dao

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class PenConverters {

    @TypeConverter
    fun stringToObject(value: String): List<Pen> {
        val listType = object : TypeToken<List<Pen>>() {

        }.type
        return Gson().fromJson(value, listType)
    }

    @TypeConverter
    fun objectToString(list: List<Pen>): String {
        val gson = Gson()
        return gson.toJson(list)
    }
}