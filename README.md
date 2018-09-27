# Pretty Numbers

## Описание
![Пример]
(example.png)

Данный плагин позволяет применять форматирование к полям ввода. Плагин поддерживает форматирование для положительных, отрицательных и дробных чисел.


## Форматирование чисел

С помощью объекта PrettyFormatter, который позволяет преобразовывать числа. У него есть два метода:

- **format(number: int)** - разбивает число на разряды
- **unformat(number: string, makeFloat:bool = false)** - возвращает число в нормальном виде

Пример:
```js
PrettyFormatter.format(12553); // '12 553'
PrettyFormatter.unformat('147 853.345', true); // 147853.345
```
## Конструктор

```js
new PrettyInput(element:Node, options:Object = {});
```

Свойства options:
- **isFloat**:bool - позволяет вводить в поле ввода дробные числа (по умолчанию __false__)-
- **isNegative**:bool - позволяет вводить в поле ввода отрицательные числа (по умолчанию __false__)
- **min**:int - минимальное значение в поле ввода. Если пустое, то проверка не выполняется
- **max**:int - максимальное значение в поле ввода. Если пустое, то проверка не выполняется
- **onChange** - функция, которая будет выполняться при срабатывании события change

## Методы

- static **find(input:node)** - возвращает экземпляр класса PrettyInput, который был создан для этого Node

## Свойства

- **input**: Node - возвращает элемент текстового поля. *Только для чтения*
- **value**: int - возвращает текущее значение поля.
- **formattedValue**: string - возвращает форматированние текущее значение поля. *Только для чтения*
- **isFloat**: bool - возможность вводить дробные числа
- **isNegative**: bool - возможность вводить отрицательные числа
- **min**: int - минимальное значение поля
- **max**: int - максимальное значение поля