abstract class ParagraphElement {
}

case class Word(word: String) extends ParagraphElement {
  override def toString: String =
    "Word(" + this.word + ")"
}

case class Space(width: Int) extends ParagraphElement {
  override def toString: String =
    "Space(" + this.width.toString + ")"
}

abstract class AlignmentClass

case class Middle() extends AlignmentClass

case class Fill() extends AlignmentClass

case class Right() extends AlignmentClass

case class Left() extends AlignmentClass

object test {

  type Line = List[ParagraphElement]
  type Paragraph = List[Line]

  def Alignment(text: List[String], screen: Int, alignType: AlignmentClass): Paragraph = {
    val maxLength = text.map(word => word.length).max
    var newAlignType = alignType
    val newScreen = Math.max(screen, maxLength)
    if (alignType == Fill())
      newAlignType = Left()
    def MakeString(words: List[String], width: Int, str: List[String]): Paragraph = {
      if (words.isEmpty)
        Nil
      else if (words.tail.isEmpty && words.head.length <= width) {
        val reversed = (words.head :: str).reverse;
        AlignString(reversed, width - words.head.length, newAlignType, Spaces(reversed)) :: Nil
      } else if (words.head.length > width)
        AlignString(str.reverse, width + 1, alignType, Spaces(str.reverse)) :: MakeString(words, newScreen, Nil)
      else
        MakeString(words.tail, width - words.head.length - 1, words.head :: str)
    }
    MakeString(text, newScreen, Nil)
  }

  def Spaces(words: List[String]): Line = {
    if (words.isEmpty)
      Nil
    else if (words.tail.isEmpty)
      new Word(words.head) :: Nil
    else
      new Word(words.head) :: Space(1) :: Spaces(words.tail)
  }

  def AlignString(words: List[String], width: Int, alignType: AlignmentClass, res: Line): Line = {
    if (alignType == Fill()) {
      val spaces = 1 + width / words.length
      res.map((elem: ParagraphElement) => elem match {
        case Space(1) => new Space(spaces)
        case Word(s) => new Word(s)
      })
    }
    val border = width / 2
    if (width != 0)
      alignType match {
        case Middle() =>
          if (border != 0)
            new Space(width - border) :: res ::: List(new Space(border))
          else
            new Space(width - border) :: res
        case Fill() =>
          if (res.tail.isEmpty)
            res.head :: new Space(width) :: Nil
          else
            res.head :: new Space(width) :: res.tail.tail
        case Right() =>
          new Space(width) :: res
        case Left() =>
          res :+ new Space(width)
      } else
      res
  }

  def main(args: Array[String]) {
    print(Alignment(List("Lorem", "get", "you", "be", "as", "sir", "dv"), 8, Fill()))
  }
}