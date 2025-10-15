import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AosService } from '../../core/services/aos.service';

@Directive({
  selector: '[dataAos]',
  standalone: true,
})
export class AosDirective implements OnInit, OnChanges {
  @Input('dataAos') aosName?: string;
  @Input('dataAosDuration') aosDuration?: string | number;

  constructor(private el: ElementRef, private aos: AosService) {}

  ngOnInit() {
    this.apply();
    this.aos.refresh();
  }

  ngOnChanges(_: SimpleChanges) {
    this.apply();
    this.aos.refresh();
  }

  private apply() {
    if (this.aosName) {
      this.el.nativeElement.setAttribute('data-aos', this.aosName);
    }
    if (this.aosDuration) {
      this.el.nativeElement.setAttribute('data-aos-duration', `${this.aosDuration}`);
    }
  }
}
