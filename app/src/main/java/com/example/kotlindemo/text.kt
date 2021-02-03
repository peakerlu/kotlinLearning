package com.example.kotlindemo

import com.example.kotlindemo.bean.Person

class text {

    companion object {
        /** 我是main入口函数 **/
        @JvmStatic
        fun main(args: Array<String>) {
            val array3 = arrayListOf("1", "2", "3")
            val array33 = arrayListOf(1, 2, 3)
            val array = intArrayOf(10, 20, 30)

            for (i in IntRange(0, array.size - 1)) {
                println(array[i])
            }
            for (i in 1 until array.size) {
                println(array[i])
            }

            array.forEach {
                println(it)
            }

        }
    }


}