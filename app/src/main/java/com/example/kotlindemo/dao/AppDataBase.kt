package com.example.kotlindemo.dao

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.kotlindemo.base.MyApplication

@Database(entities = [Student::class, Teacher::class], version = 1)
abstract class AppDataBase : RoomDatabase() {
    abstract fun getStudentDao(): StudentDao

    abstract fun getTeacherDao(): TeacherDao

    companion object {

        @Volatile
        private var instance: AppDataBase? = null

        fun getDBInstace(): AppDataBase {

            if (instance == null) {

                synchronized(AppDataBase::class) {

                    if (instance == null) {

                        instance = Room.databaseBuilder(
                            MyApplication.instance(),
                            AppDataBase::class.java,
                            "User.db"
                        )
                            .allowMainThreadQueries()
                            .build()
                    }
                }
            }
            return instance!!
        }

    }

}

