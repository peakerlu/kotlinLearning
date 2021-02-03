package com.example.kotlindemo

import com.example.kotlindemo.bean.User
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kto.Utils
import org.junit.Test
import java.lang.reflect.Type

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        val json = "{\n" +
                "    \"userName\": \"小明名\",\n" +
                "    \"age\": 28\n" +
                "}"
        val user = fromJson(json, User::class.java)
        println(user?.userName)
        var list = ArrayList<User>()
//        fromJson<user>(json,)

        val jsonList = " [\n" +
                "        {\n" +
                "            \"userName\": \"小明\",\n" +
                "            \"age\": \"28\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"userName\": \"小红\",\n" +
                "            \"age\": \"28\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"userName\": \"小呗\",\n" +
                "            \"age\": \"28\"\n" +
                "        }\n" +
                "    ]"
        val type = object : TypeToken<List<User>>() {}.type
        var users = fromJson<List<User>>(jsonList, type)
        println(users?.get(1)?.userName)

        var users2 = fromJson2<List<User>>(jsonList)
        val user2 = fromJson2<User>(json)
        println(users2?.get(2)?.userName)
        println(user2?.userName)
        println("-------------------------------------------")


//        var userss = fromJson2List<User>(jsonList)
//        var fromJson2List = Utils.fromJson2List<User>(jsonList)
//        println(fromJson2List?.get(0)?.userName)
        var fromJson2List = com.example.kotlindemo.utils.Utils.fromJson2List<User>(jsonList)
        println(fromJson2List?.get(0)?.userName)
    }

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
