object firstTasks extends App {

  object pascalTriangle {//1
  def getElement(x: Int, y: Int): Int = {
    if (x == 0 || y == 0)
      1
    else
      pascalTriangle.getElement(x - 1, y - 1) + pascalTriangle.getElement(x - 1, y + 1)
  }
  }

  object brackets {//2
  def isBalanced(list: List[Char]): Boolean = {
    if (getBalance(list, 0) == 0)
      true
    else
      false
  }

    def getBalance(list: List[Char], curBalance: Int): Int = {
      if (list.isEmpty)
        curBalance
      else if (list.head == '(')
        getBalance(list.tail, curBalance + 1)
      else if (list.head == ')')
        getBalance(list.tail, curBalance - 1)
      else
        getBalance(list.tail, curBalance)
    }
  }

  //println(brackets.isBalanced("()()()()()".toList));


  object coins {//3
  def countChange(money: Int, coins: List[Int]): Int = {
    if (coins.isEmpty || money < 0)
      0
    else if (money == 0)
      1
    else
      countChange(money - coins.head, coins) + countChange(money, coins.tail)
  }
  }


  //println(coins.countChange(15, List(10, 5, 1)))

  object equations {//4
  def solveQuadratic(coefficients: List[Double]): List[Double] = {
    val List(a, b, c) = coefficients
    if (a == 0) {
      return solveLinear(List(b, c))
    }

    val D = b*b - 4*a*c
    if (D < 0)
      List()
    else if (D == 0)
      List(-b/(2*a))
    else {
      val x1 = (-b - Math.sqrt(D))/(2*a)
      val x2 = (-b + Math.sqrt(D))/(2*a)
      List(x1, x2)
    }
  }

    def solveCubic(coefficients: List[Double]): List[Double] = {
      var List(a, b, c, d) = coefficients
      if (d == 0)
        0 :: solveQuadratic(List(a, b, c))
      else if (a == 0)
        solveQuadratic(List(b, c, d))
      else {
        b = b/a
        c = c/a
        d = d/a

        a = b; b = c; c = d//small shift

        val Q: Double = (a*a - 3*b)/9
        val R: Double = (2*a*a*a - 9*a*b + 27*c)/54
        val D: Double = R*R - Q*Q*Q



        if (D < 0) {
          val t: Double = Math.acos(R/Math.sqrt(Q*Q*Q))/3
          val x1: Double = -2 * Math.sqrt(Q) * Math.cos(t) - a/3
          val x2: Double = -2 * Math.sqrt(Q) * Math.cos(t + (2*Math.PI/3)) - a/3
          val x3: Double = -2 * Math.sqrt(Q) * Math.cos(t - (2*Math.PI/3)) - a/3

          List(x1, x2, x3)
        } else {
          val A: Double = -Math.signum(R) * Math.pow(Math.abs(R) + Math.sqrt(D), 1.0/3.0)
          var B: Double = 0

          val answer = List()

          if (A != 0) {
            B = Q/A
            if (A == B)
              -A - a/3 :: answer
          }
          (A + B) - a/3 :: answer
        }

      }
    }

    def solveLinear(coefficients: List[Double]): List[Double]= {
      val List(a, b) = coefficients

      if (a == 0) {
        if (b == 0)
          List(1.0/0)
        else
          List()
      } else
        List(-b/a)
    }
  }

  //println(equations.solveQuadratic(List(1,-10,25)))
  //println(equations.solveCubic(List(-13,5,6, 1)))


  object ListOps {// >=5
  def reverse(list: List[Any]): List[Any] = {//5
  def reverse_(list: List[Any], reversedList: List[Any]): List[Any] = {
    if (list.isEmpty)
      reversedList
    else
      reverse_(list.tail, list.head :: reversedList)
  }
    reverse_(list, List())
  }

    def addToEnd(list: List[Any], el: Any): List[Any] = {//6
      if (list.isEmpty)
        List(el)
      else
        list.head :: addToEnd(list.tail, el)
    }

    def length(list: List[Any]): Int = {//7
    def length_(list: List[Any], currentLength: Int): Int = {
      if (list.isEmpty)
        currentLength
      else
        length_(list.tail, currentLength + 1)
    }
      length_(list, 0)
    }

    def sum(list: List[Double]): Double = {//8
    def sum_(list: List[Double], currentSum: Double): Double = {
      if (list.isEmpty)
        currentSum
      else
        sum_(list.tail, currentSum + list.head)
    }
      sum_(list, 0)
    }


    def filterSpecial(list: List[Int]): List[Int] = {//9
      filter(list, (x: Int) => x % 2 == 0)
    }

    def filter[T](list: List[T], func: T => Boolean): List[T] = {//10
      if (list.isEmpty)
        Nil
      else {
        if (func(list.head))
          list.head :: filter(list.tail, func)
        else
          filter(list.tail, func)
      }
    }
  }

  //println(ListOps.reverse(List(-13,5,6, 1)))
  //println(ListOps.addToEnd(List(-13,5,6, 1), 14))
  //println(ListOps.sum(List(-13,5,6, 1)))
  //println(ListOps.length(List(-13,5,6, 1)))
  //println(ListOps.filterSpecial(List(-13,5,6, 1)))
  //println(ListOps.filter(List(-13,5,6, 1), (x: Int) => x > 0))
}


