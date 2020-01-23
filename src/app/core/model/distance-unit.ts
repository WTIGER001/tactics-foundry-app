
export class DistanceUnit {
  public static units: DistanceUnit[] = []
  public static readonly Feet = new DistanceUnit('Feet', "ft", 1)
  public static readonly Yard = new DistanceUnit('Yard', "yd", 3)
  public static readonly Mile = new DistanceUnit('Mile', "mi", 5280)

  constructor(public readonly name: string, public readonly abbr: string, public readonly meters: number) {
    DistanceUnit.units.push(this)
  }

  public toFeet(value: number) {
    return this.meters * value
  }

  public fromFeet(value: number) {
    return value / this.meters
  }

  public static getUnit(nameOrAbbr: string): DistanceUnit {
    if (!nameOrAbbr) {
      return undefined
    }

    let found
    DistanceUnit.units.forEach(u => {
      if (u.name.toLowerCase() == nameOrAbbr.toLowerCase() || u.abbr.toLowerCase() == nameOrAbbr.toLowerCase()) {
        found = u
      }
    })
    return found
  }
}

export class Distance {
  constructor(public value: number, public unit: string) {
  }

  static toFeet2(value: number, unitStr: string) {
    const foundUnit = DistanceUnit.getUnit(unitStr)
    if (foundUnit) {
      return foundUnit.toFeet(value)
    }
    return value
  }

  static toFeet(distance: Distance) {
    const foundUnit = DistanceUnit.getUnit(distance.unit)
    if (foundUnit) {
      return foundUnit.toFeet(distance.value)
    }
    return distance.value
  }

  asFeet(): number {
    return Distance.toFeet(this)
  }

  fromFeet(val: number) {
    const foundUnit = DistanceUnit.getUnit(this.unit)
    if (foundUnit) {
      this.value = foundUnit.fromFeet(val)
    } else {
      console.error("No Unit found", this.unit);
    }
  }
}