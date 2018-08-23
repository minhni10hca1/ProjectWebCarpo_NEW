export class LoggedInUserCampaign {
  constructor(name: string, areacode: string, areaname: string, start_time: string, end_time: string, status: Boolean,
    total_car: Number, impressionNo: Number, cars: any[]
  ) {
    this.name = name;
    this.areacode = areacode;
    this.areaname = areaname;
    this.start_time = start_time;
    this.end_time = end_time;
    this.status = status;
    this.total_car = total_car;
    this.impressionNo = impressionNo;
    this.cars = cars;
  }
  public name: string;
  public areacode: string;
  public areaname: string;
  public start_time: string;
  public end_time: string;
  public status: Boolean;
  public total_car: Number;
  public impressionNo: Number;
  public cars: any[];
}
