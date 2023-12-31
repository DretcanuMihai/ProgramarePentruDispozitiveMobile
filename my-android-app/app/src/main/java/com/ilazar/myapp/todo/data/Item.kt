package com.ilazar.myapp.todo.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.*

@Entity(tableName = "items")
data class Item(@PrimaryKey var _id: String = "",
                var celebrationDate: String = getCurrentDate(),
                var received: Boolean = false,
                var sentimentalValue: Int = 0,
                var text: String = "",
                var lat:Double=46.0,
                var lng:Double=23.0,
)

fun getCurrentDate(): String{
    val calendar = Calendar.getInstance()

    val year = calendar.get(Calendar.YEAR)
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)

    return "$year/${month + 1}/$day"
}