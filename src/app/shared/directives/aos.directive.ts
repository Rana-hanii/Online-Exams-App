import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AosService } from '../../core/services/aos.service';

@Directive({
  // support both camelCase usage and standard hyphenated attribute
  selector: '[dataAos],[data-aos]',
  standalone: true,
})
export class AosDirective implements AfterViewInit, OnChanges {
  // support camelCase and hyphenated aliases
  @Input('dataAos') aosName?: string;
  @Input('data-aos') aosHyphen?: string;
  @Input('dataAosDuration') aosDuration?: string | number;
  @Input('data-aos-duration') aosDurationHyphen?: string | number;

  constructor(private el: ElementRef, private aos: AosService) {}

  ngAfterViewInit() {
    this.apply();
    // small timeout ensures child components/templates are rendered
    setTimeout(() => this.aos.refresh(), 50);
  }

  ngOnChanges(_: SimpleChanges) {
    this.apply();
    setTimeout(() => this.aos.refresh(), 50);
  }

  private apply() {
    const name = this.aosName ?? this.aosHyphen;
    const duration = this.aosDuration ?? this.aosDurationHyphen;

    if (name) {
      this.el.nativeElement.setAttribute('data-aos', name);
    }
    if (duration) {
      this.el.nativeElement.setAttribute('data-aos-duration', `${duration}`);
    }
  }
}
