package kto

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.lang.reflect.Type

object Utils {

    fun <T> fromJson(json: String, clazz: Class<T>): T? {
        return try {
            Gson().fromJson(json, clazz)
        } catch (ignore: Exception) {
            null
        }
    }


    fun <T> fromJson(json: String, type: Type): T? {
        return try {
            return Gson().fromJson(json, type)
        } catch (e: Exception) {
            null
        }
    }

    inline fun <reified T> fromJson(json: String): T? {
        return try {
            return Gson().fromJson(json, T::class.java)
        } catch (e: Exception) {
            null
        }
    }

    inline fun <reified T> fromJson2(json: String): T? {
        return try {
            //借助TypeToken类获取具体的泛型类型
            val type = object : TypeToken<T>() {}.type
            return Gson().fromJson(json, type)
        } catch (e: Exception) {
            null
        }
    }

    inline fun <reified T> fromJson2List(json: String) = fromJson2<List<T>>(json)
}