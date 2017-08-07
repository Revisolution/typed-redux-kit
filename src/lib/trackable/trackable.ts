export abstract class Trackable<T>  {
  public $$trackable = true
  public $$parent?: Trackable<any>
  public $$isChanged: boolean = false

  public abstract clone (): T
  public abstract onChildChange (child: any): void
  public abstract toJS (): any

  public markAsChanged () {
    this.$$isChanged = true

    if (this.$$parent) {
      this.$$parent.onChildChange(this)
    }
  }

  public setParent (parent: Trackable<any>) {
    this.$$parent = parent
  }
}
