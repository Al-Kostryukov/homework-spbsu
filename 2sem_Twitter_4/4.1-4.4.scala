package objsets

/**
  * A class to represent tweets.
  */
class Tweet(val user: String, val text: String, val retweets: Int) {
  override def toString: String =
    "User: " + user + "\n" +
      "Text: " + text + " [" + retweets + "]"
}

/**
  * This represents a set of objects of type `Tweet` in the form of a binary search
  * tree. Every branch in the tree has two children (two `TweetSet`s). There is an
  * invariant which always holds: for every branch `b`, all elements in the left
  * subtree are smaller than the tweet at `b`. The elements in the right subtree are
  * larger.
  *
  * Note that the above structure requires us to be able to compare two tweets (we
  * need to be able to say which of two tweets is larger, or if they are equal). In
  * this implementation, the equality / order of tweets is based on the tweet's text
  * (see `def incl`). Hence, a `TweetSet` could not contain two tweets with the same
  * text from different users.
  *
  *
  * The advantage of representing sets as binary search trees is that the elements
  * of the set can be found quickly. If you want to learn more you can take a look
  * at the Wikipedia page [1], but this is not necessary in order to solve this
  * assignment.
  *
  * [1] http://en.wikipedia.org/wiki/Binary_search_tree
  */
abstract class TweetSet {

  /**
    * This method takes a predicate and returns a subset of all the elements
    * in the original set for which the predicate is true.
    *
    * Question: Can we implement this method here, or should it remain abstract
    * and be implemented in the subclasses?
    */
  def filter(p: Tweet => Boolean): TweetSet =
    filterAcc(p, new Empty)

  /**
    * This is a helper method for `filter` that propagetes the accumulated tweets.
    */
  def filterAcc(p: Tweet => Boolean, acc: TweetSet): TweetSet


  /**
    * Returns a new `TweetSet` that is the union of `TweetSet`s `this` and `that`.
    *
    * Question: Should we implment this method here, or should it remain abstract
    * and be implemented in the subclasses?
    */
  def union(that: TweetSet): TweetSet

  /**
    * Returns the tweet from this set which has the greatest retweet count.
    *
    * Calling `mostRetweeted` on an empty set should throw an exception of
    * type `java.util.NoSuchElementException`.
    *
    * Question: Should we implment this method here, or should it remain abstract
    * and be implemented in the subclasses
    */
  def isEmpty: Boolean

  def mostRetweeted: Tweet

  /**
    * Returns a list containing all tweets of this set, sorted by retweet count
    * in descending order. In other words, the head of the resulting list should
    * have the highest retweet count.
    *
    * Hint: the method `remove` on TweetSet will be very useful.
    * Question: Should we implment this method here, or should it remain abstract
    * and be implemented in the subclasses?
    */
  def descendingByRetweet: TweetList

  /**
    * The following methods are already implemented
    */

  /**
    * Returns a new `TweetSet` which contains all elements of this set, and the
    * the new element `tweet` in case it does not already exist in this set.
    *
    * If `this.contains(tweet)`, the current set is returned.
    */
  def incl(tweet: Tweet): TweetSet

  /**
    * Returns a new `TweetSet` which excludes `tweet`.
    */
  def remove(tweet: Tweet): TweetSet

  /**
    * Tests if `tweet` exists in this `TweetSet`.
    */
  def contains(tweet: Tweet): Boolean

  /**
    * This method takes a function and applies it to every element in the set.
    */
  def foreach(f: Tweet => Unit): Unit

  /**
    * This method returns most popular tweets containing any of keywords.
    */
  def trending(words : List[String]): TweetList =
    this.filter(
      {T: Tweet =>
        words.exists(
          {word: String =>
            T.text.contains(word)})}).descendingByRetweet
}

class Empty extends TweetSet {
  def filterAcc(p: Tweet => Boolean, acc: TweetSet): TweetSet = acc

  def union(that: TweetSet): TweetSet = that

  def mostRetweeted: Tweet =
    throw new java.util.NoSuchElementException("No retweeted in Empty TweetSet")

  def descendingByRetweet: TweetList = Nil

  def isEmpty: Boolean = true

  /**
    * The following methods are already implemented
    */

  def contains(tweet: Tweet): Boolean = false

  def incl(tweet: Tweet): TweetSet = new NonEmpty(tweet, new Empty, new Empty)

  def remove(tweet: Tweet): TweetSet = this

  def foreach(f: Tweet => Unit): Unit = ()
}

class NonEmpty(elem: Tweet, left: TweetSet, right: TweetSet) extends TweetSet {

  def filterAcc(p: Tweet => Boolean, acc: TweetSet): TweetSet =
    right.filterAcc(p, left.filterAcc(p, if (p(elem)) acc.incl(elem) else acc))

  def union(that: TweetSet): TweetSet =
    left.union(right.union(that.incl(elem)))

  def isEmpty: Boolean = false

  def mostRetweeted: Tweet = {
    if (left.isEmpty) {
      if (right.isEmpty)
        elem
      else {
        val rightMax: Tweet = right.mostRetweeted
        if (elem.retweets < rightMax.retweets)
          rightMax
        else
          elem
      }
    } else if (right.isEmpty) {
      val leftMax: Tweet = left.mostRetweeted
      if (elem.retweets < leftMax.retweets)
        leftMax
      else
        elem
    } else {
      val leftMax: Tweet = left.mostRetweeted
      val rightMax: Tweet = right.mostRetweeted
      if (elem.retweets < leftMax.retweets)
        if (leftMax.retweets < rightMax.retweets)
          rightMax
        else
          leftMax
      else if (elem.retweets > rightMax.retweets)
        elem
      else
        rightMax
    }
  }

  def descendingByRetweet: TweetList = {
    val mR: Tweet = this.mostRetweeted
    val this_but_mR: TweetSet = this.remove(mR)
    new Cons(mR, this_but_mR.descendingByRetweet)
  }


  def contains(x: Tweet): Boolean = {
    if (x.text < elem.text)
      left.contains(x)
    else if (elem.text < x.text)
      right.contains(x)
    else
      true
  }

  def incl(x: Tweet): TweetSet = {
    if (x.text < elem.text)
      new NonEmpty(elem, left.incl(x), right)
    else if (elem.text < x.text)
      new NonEmpty(elem, left, right.incl(x))
    else
      this
  }

  def remove(tw: Tweet): TweetSet = {
    if (tw.text < elem.text)
      new NonEmpty(elem, left.remove(tw), right)
    else if (elem.text < tw.text)
      new NonEmpty(elem, left, right.remove(tw))
    else
      left.union(right)
  }

  def foreach(f: Tweet => Unit): Unit = {
    f(elem)
    left.foreach(f)
    right.foreach(f)
  }


}

trait TweetList {
  def head: Tweet
  def tail: TweetList
  def isEmpty: Boolean
  def foreach(f: Tweet => Unit): Unit =
    if (!isEmpty) {
      f(head)
      tail.foreach(f)
    }
}

object Nil extends TweetList {
  def head = throw new java.util.NoSuchElementException("head of EmptyList")
  def tail = throw new java.util.NoSuchElementException("tail of EmptyList")
  def isEmpty = true
}

class Cons(val head: Tweet, val tail: TweetList) extends TweetList {
  def isEmpty = false
}

object Main extends App {
  //tweets.trending(List("politics", "it", "hobby")) foreach println
}